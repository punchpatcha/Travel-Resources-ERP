// routes/booking.route.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST: Create a new booking
router.post('/', bookingController.createBooking);

// GET: Retrieve all bookings
router.get('/', bookingController.getAllBookings);

// GET: Retrieve a specific booking by ID
router.get('/:id', bookingController.getBookingById);

// PUT: Update a booking by ID
router.put('/:id', bookingController.updateBooking);

// DELETE: Delete a booking by ID
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
