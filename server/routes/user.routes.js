const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser
} = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Routes
router.use(protect); // All user routes are protected

router.route('/')
  .get(restrictTo('admin'), getAllUsers);

router.route('/profile')
  .patch(updateUser);

router.route('/:id')
  .get(getUserById)
  .patch(restrictTo('admin'), updateUserRole)
  .delete(restrictTo('admin'), deleteUser);

module.exports = router;
