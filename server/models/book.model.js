const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A book must have a title'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'A book must have an author'],
      trim: true
    },
    isbn: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      trim: true
    },
    genre: {
      type: [String],
      required: [true, 'A book must have at least one genre']
    },
    publishedYear: Number,
    publisher: String,
    language: String,
    pages: Number,
    coverImage: String,
    availableCopies: {
      type: Number,
      default: 1,
      min: [0, 'Available copies cannot be negative']
    },
    totalCopies: {
      type: Number,
      default: 1,
      min: [1, 'Total copies must be at least 1']
    },
    location: {
      shelf: String,
      section: String
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
      set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
    },
    ratingsCount: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ isbn: 1 });

// Virtual populate for reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id'
});

// Virtual populate for reservations
bookSchema.virtual('reservations', {
  ref: 'Reservation',
  foreignField: 'book',
  localField: '_id'
});

// Virtual for availability status
bookSchema.virtual('availabilityStatus').get(function() {
  if (this.availableCopies > 0) return 'Available';
  return 'Unavailable';
});

// Only find active books
bookSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
