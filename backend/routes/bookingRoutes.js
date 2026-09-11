const express = require('express');
const router = express.Router();
const {
  holdSeats,
  payAtCounter,
  cancelHold,
  getMyBookings,
  getAllBookings,
  getBookingById,
  getBookingReceipt,
  getBookingStatus,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/hold', protect, holdSeats);
router.post('/pay-counter', protect, payAtCounter);
router.post('/cancel', protect, cancelHold);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, admin, getAllBookings);
router.get('/:id/status', protect, getBookingStatus);
router.get('/:id/receipt', protect, getBookingReceipt);
router.get('/:id', protect, getBookingById);

module.exports = router;
