const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  bookingCode: {
    type: String,
    required: true,
    unique: true,
  },
  paymentMethod: {
    type: String,
    enum: ['PAY_AT_COUNTER'],
    default: 'PAY_AT_COUNTER',
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    default: 'PENDING',
  },
  bookingStatus: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED', 'EXPIRED'],
    default: 'CONFIRMED',
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
