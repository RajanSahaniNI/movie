const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  genre: {
    type: [String],
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: 'English',
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
  },
  rating: {
    type: Number,
    default: 8.5,
  },
  director: {
    type: String,
  },
  cast: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
