const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Returned', 'Booked', 'In Use', 'Canceled', 'Pending'],
    default: 'Pending',
  },
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
