const mongoose = require('mongoose');
const Book = require('./book.model');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Book',
      required: [true, 'Review must belong to a book']
    },
    rating: {
      type: Number,
      required: [true, 'Review must have a rating'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Review must have a comment'],
      trim: true
    },
    likes: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent duplicate reviews (one review per user per book)
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

// Populate user reference
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name profilePicture'
  });
  
  next();
});

// Only find active reviews
reviewSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// Static method to calculate average ratings
reviewSchema.statics.calcAverageRatings = async function(bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      ratingsCount: stats[0].nRating,
      averageRating: stats[0].avgRating
    });
  } else {
    await Book.findByIdAndUpdate(bookId, {
      ratingsCount: 0,
      averageRating: 0
    });
  }
};

// Call calcAverageRatings after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.book);
});

// Call calcAverageRatings before findOneAndUpdate/Delete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

// Call calcAverageRatings after findOneAndUpdate/Delete
reviewSchema.post(/^findOneAnd/, async function() {
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.book);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
