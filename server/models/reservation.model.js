const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reservation must belong to a user']
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'Reservation must be for a book']
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled', 'overdue'],
      default: 'pending'
    },
    reservationDate: {
      type: Date,
      default: Date.now
    },
    pickupDate: Date,
    dueDate: {
      type: Date,
      required: [true, 'Reservation must have a due date']
    },
    returnDate: Date,
    notes: String,
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
reservationSchema.index({ user: 1, book: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ dueDate: 1 });

// Populate user and book references
reservationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email studentId'
  }).populate({
    path: 'book',
    select: 'title author isbn coverImage'
  });
  
  next();
});

// Virtual for days remaining
reservationSchema.virtual('daysRemaining').get(function() {
  if (!this.dueDate) return null;
  
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
});

// Virtual for is overdue
reservationSchema.virtual('isOverdue').get(function() {
  if (!this.dueDate || this.status !== 'active') return false;
  
  const today = new Date();
  const due = new Date(this.dueDate);
  
  return today > due;
});

// Update book availability when reservation is created
reservationSchema.post('save', async function() {
  if (this.status === 'active' || this.status === 'pending') {
    await this.model('Book').findByIdAndUpdate(this.book, {
      $inc: { availableCopies: -1 }
    });
  }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
