const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Protected routes
router.use(protect);

router.route('/')
  .post(restrictTo('admin'), createBook);

router.route('/:id')
  .patch(restrictTo('admin'), updateBook)
  .delete(restrictTo('admin'), deleteBook);

module.exports = router;
