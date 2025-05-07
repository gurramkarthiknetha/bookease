const Reservation = require('../models/reservation.model');
const Book = require('../models/book.model');

// Get all reservations (admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get user's reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if the reservation belongs to the user or user is admin
    if (reservation.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this reservation'
      });
    }

    res.status(200).json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Create new reservation
exports.createReservation = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for reservation'
      });
    }

    // Create reservation
    const reservation = await Reservation.create({
      user: req.user.id,
      book: bookId,
      dueDate,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Only admin can update status to anything
    // Students can only cancel their own reservations
    if (req.user.role !== 'admin' && 
        (reservation.user._id.toString() !== req.user.id || status !== 'cancelled')) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this reservation'
      });
    }

    // Handle book availability based on status change
    const oldStatus = reservation.status;
    
    // If changing from active/pending to completed/cancelled, increase available copies
    if ((oldStatus === 'active' || oldStatus === 'pending') && 
        (status === 'completed' || status === 'cancelled')) {
      await Book.findByIdAndUpdate(reservation.book._id, {
        $inc: { availableCopies: 1 }
      });
    }
    
    // If changing from completed/cancelled to active/pending, decrease available copies
    if ((oldStatus === 'completed' || oldStatus === 'cancelled') && 
        (status === 'active' || status === 'pending')) {
      const book = await Book.findById(reservation.book._id);
      if (book.availableCopies <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Book is not available for reservation'
        });
      }
      
      await Book.findByIdAndUpdate(reservation.book._id, {
        $inc: { availableCopies: -1 }
      });
    }

    // Update reservation
    reservation.status = status;
    
    // If status is active, set pickup date
    if (status === 'active' && !reservation.pickupDate) {
      reservation.pickupDate = Date.now();
    }
    
    // If status is completed, set return date
    if (status === 'completed' && !reservation.returnDate) {
      reservation.returnDate = Date.now();
    }
    
    await reservation.save();

    res.status(200).json({
      success: true,
      reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
