const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Show = require('./models/Show');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Periodic background job to auto-release expired held seats
setInterval(async () => {
  try {
    const now = new Date();
    const showsWithHolds = await Show.find({ 'seats.status': 'HELD' });
    for (const show of showsWithHolds) {
      if (show.cleanExpiredHolds()) {
        await show.save();
      }
    }
  } catch (err) {
    console.error('Background seat expiry cleanup error:', err.message);
  }
}, 30000); // every 30 seconds

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🎬 Movie Booking Backend running on http://localhost:${PORT}`);
});

module.exports = { app, server };
