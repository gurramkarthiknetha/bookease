const express = require('express');
const router = express.Router();
const {
  getBookReviews,
  getUserReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/book/:bookId', getBookReviews);
router.get('/:id', getReviewById);

// Protected routes
router.use(protect);

router.route('/')
  .post(createReview);

router.get('/my-reviews', getUserReviews);

router.route('/:id')
  .patch(updateReview)
  .delete(deleteReview);

module.exports = router;
