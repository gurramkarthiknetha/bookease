const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const corsMiddleware = require('./middleware/cors.middleware');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Apply custom CORS middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/reservations', require('./routes/reservation.routes'));
app.use('/api/reviews', require('./routes/review.routes'));

// Root route
app.get('/', (req, res) => {
  res.send('BookEase API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
