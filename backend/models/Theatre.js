const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Screen 1',
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 60,
  },
  rows: {
    type: [String],
    default: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
  seatsPerRow: {
    type: Number,
    default: 10,
  },
});

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theatre name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  address: {
    type: String,
  },
  screens: [screenSchema],
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);
