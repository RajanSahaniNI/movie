const Show = require('../models/Show');
const Booking = require('../models/Booking');
const generateBookingCode = require('../utils/generateBookingCode');
const generateReceiptPDF = require('../utils/generateReceipt');

// @desc    Hold seats for 15-minute transaction window
// @route   POST /api/bookings/hold
// @access  Private
const holdSeats = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user._id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one seat' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Clean expired holds first
    show.cleanExpiredHolds();

    const now = new Date();
    const lockExpiry = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes window

    // Concurrency / Availability check
    for (const seatNum of seats) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);

      if (!seat) {
        return res.status(400).json({ success: false, message: `Seat ${seatNum} is invalid for this screen` });
      }

      if (seat.status === 'BOOKED') {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is already booked. Please select another seat.`,
        });
      }

      if (
        seat.status === 'HELD' &&
        seat.lockedUntil &&
        seat.lockedUntil > now &&
        seat.lockedBy &&
        seat.lockedBy.toString() !== userId.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: `Seat ${seatNum} is temporarily held by another user. Please select another seat.`,
        });
      }
    }

    // Release any previous holds by this user on other seats in this show
    show.seats.forEach((seat) => {
      if (
        seat.status === 'HELD' &&
        seat.lockedBy &&
        seat.lockedBy.toString() === userId.toString() &&
        !seats.includes(seat.seatNumber)
      ) {
        seat.status = 'AVAILABLE';
        seat.lockedBy = null;
        seat.lockedUntil = null;
      }
    });

    // Apply hold to requested seats
    show.seats.forEach((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.status = 'HELD';
        seat.lockedBy = userId;
        seat.lockedUntil = lockExpiry;
      }
    });

    await show.save();

    res.json({
      success: true,
      message: 'Seats held successfully for 15 minutes',
      showId: show._id,
      seats,
      lockedUntil: lockExpiry,
      expiresInSeconds: 15 * 60,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete Pay at Counter booking
// @route   POST /api/bookings/pay-counter
// @access  Private
const payAtCounter = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user._id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please specify show and seats to book' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Clean expired holds
    show.cleanExpiredHolds();

    const now = new Date();

    // Verify all requested seats are currently held by this user and not expired
    for (const seatNum of seats) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);

      if (!seat) {
        return res.status(400).json({ success: false, message: `Seat ${seatNum} does not exist` });
      }

      if (seat.status === 'BOOKED') {
        return res.status(400).json({
          success: false,
          message: 'This seat is already booked. Please select another seat.',
        });
      }

      const isHeldByMe =
        seat.status === 'HELD' &&
        seat.lockedBy &&
        seat.lockedBy.toString() === userId.toString() &&
        seat.lockedUntil &&
        seat.lockedUntil > now;

      if (!isHeldByMe) {
        return res.status(400).json({
          success: false,
          message: 'Transaction cancelled or seat hold expired. Your selected seat has been released. Please try again.',
        });
      }
    }

    // Generate unique random booking code e.g. MVB-739251
    let bookingCode = generateBookingCode();
    let existingBooking = await Booking.findOne({ bookingCode });
    while (existingBooking) {
      bookingCode = generateBookingCode();
      existingBooking = await Booking.findOne({ bookingCode });
    }

    // Convert held seats to BOOKED permanently
    show.seats.forEach((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.status = 'BOOKED';
        seat.bookedBy = userId;
        seat.bookingCode = bookingCode;
        seat.lockedBy = null;
        seat.lockedUntil = null;
      }
    });

    await show.save();

    const totalAmount = seats.length * show.price;

    const booking = await Booking.create({
      userId,
      showId: show._id,
      seats,
      totalAmount,
      bookingCode,
      paymentMethod: 'PAY_AT_COUNTER',
      paymentStatus: 'PENDING',
      bookingStatus: 'CONFIRMED',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title poster genre duration language' },
          { path: 'theatreId', select: 'name location address' },
        ],
      })
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'The seat is booked. You can show/provide the below code at the counter to pay and get the ticket.',
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel seat hold
// @route   POST /api/bookings/cancel
// @access  Private
const cancelHold = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    const userId = req.user._id;

    if (!showId) {
      return res.status(400).json({ success: false, message: 'Show ID required' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    show.seats.forEach((seat) => {
      if (
        seat.status === 'HELD' &&
        seat.lockedBy &&
        seat.lockedBy.toString() === userId.toString() &&
        (!seats || seats.includes(seat.seatNumber))
      ) {
        seat.status = 'AVAILABLE';
        seat.lockedBy = null;
        seat.lockedUntil = null;
      }
    });

    await show.save();

    res.json({ success: true, message: 'Hold cancelled and seats released' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title poster genre duration language' },
          { path: 'theatreId', select: 'name location address' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title poster' },
          { path: 'theatreId', select: 'name location' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title poster genre duration language' },
          { path: 'theatreId', select: 'name location address' },
        ],
      })
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Verify user owns booking or is admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this booking' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate PDF receipt for booking
// @route   GET /api/bookings/:id/receipt
// @access  Private
const getBookingReceipt = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title poster genre duration language' },
          { path: 'theatreId', select: 'name location address' },
        ],
      })
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Allow owner or admin
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to access this receipt' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Receipt-${booking.bookingCode}.pdf`);

    generateReceiptPDF(booking, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking status
// @route   GET /api/bookings/:id/status
// @access  Private
const getBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).select('bookingStatus paymentStatus bookingCode');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, status: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  holdSeats,
  payAtCounter,
  cancelHold,
  getMyBookings,
  getAllBookings,
  getBookingById,
  getBookingReceipt,
  getBookingStatus,
};
