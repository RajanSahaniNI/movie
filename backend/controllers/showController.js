const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// Helper to generate default seat matrix for a screen
const generateSeats = (rows = ['A', 'B', 'C', 'D', 'E', 'F'], seatsPerRow = 10) => {
  const seats = [];
  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        seatNumber: `${row}${i}`,
        row: row,
        number: i,
        status: 'AVAILABLE',
        lockedBy: null,
        lockedUntil: null,
      });
    }
  });
  return seats;
};

// @desc    Get all shows with optional query params (movieId, theatreId, date)
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;
    let query = {};

    if (movieId) query.movieId = movieId;
    if (theatreId) query.theatreId = theatreId;
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movieId', 'title poster language duration rating genre')
      .populate('theatreId', 'name location address screens')
      .sort({ date: 1, startTime: 1 });

    // Clean expired holds on the fetched shows
    for (const show of shows) {
      if (show.cleanExpiredHolds()) {
        await show.save();
      }
    }

    res.json({ success: true, count: shows.length, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single show by ID (with seat states)
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title poster description genre language duration rating')
      .populate('theatreId', 'name location address screens');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Clean expired holds and save if modified
    if (show.cleanExpiredHolds()) {
      await show.save();
    }

    res.json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res) => {
  try {
    const { movieId, theatreId, screen, date, startTime, price } = req.body;

    // Fetch theatre to inspect screen layout if available
    let rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    let seatsPerRow = 10;

    if (theatreId) {
      const theatre = await Theatre.findById(theatreId);
      if (theatre && theatre.screens && theatre.screens.length > 0) {
        const matchedScreen = theatre.screens.find((s) => s.name === screen) || theatre.screens[0];
        if (matchedScreen.rows && matchedScreen.rows.length > 0) rows = matchedScreen.rows;
        if (matchedScreen.seatsPerRow) seatsPerRow = matchedScreen.seatsPerRow;
      }
    }

    const seats = generateSeats(rows, seatsPerRow);

    const show = await Show.create({
      movieId,
      theatreId,
      screen: screen || 'Screen 1',
      date,
      startTime,
      price: price || 250,
      seats,
    });

    res.status(201).json({ success: true, show });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.json({ success: true, show });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getShows,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
};
