const express = require('express');
const router = express.Router();
const {
  getAllReservations,
  getUserReservations,
  getReservationById,
  createReservation,
  updateReservationStatus
} = require('../controllers/reservation.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All reservation routes are protected
router.use(protect);

router.route('/')
  .get(restrictTo('admin'), getAllReservations)
  .post(createReservation);

router.get('/my-reservations', getUserReservations);

router.route('/:id')
  .get(getReservationById)
  .patch(updateReservationStatus);

module.exports = router;
