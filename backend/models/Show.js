const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
  },
  number: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'HELD', 'BOOKED'],
    default: 'AVAILABLE',
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  lockedUntil: {
    type: Date,
    default: null,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  bookingCode: {
    type: String,
    default: null,
  },
}, { _id: false });

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
  },
  screen: {
    type: String,
    required: true,
    default: 'Screen 1',
  },
  date: {
    type: String, // Format YYYY-MM-DD
    required: true,
  },
  startTime: {
    type: String, // Format HH:mm (e.g. 18:30)
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 250,
  },
  seats: [seatSchema],
}, { timestamps: true });

// Auto-clean expired holds before returning or updating
showSchema.methods.cleanExpiredHolds = function () {
  const now = new Date();
  let changed = false;
  this.seats.forEach((seat) => {
    if (seat.status === 'HELD' && seat.lockedUntil && seat.lockedUntil <= now) {
      seat.status = 'AVAILABLE';
      seat.lockedBy = null;
      seat.lockedUntil = null;
      changed = true;
    }
  });
  return changed;
};

module.exports = mongoose.model('Show', showSchema);
