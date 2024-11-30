const express = require('express');
const Booking = require('../model/Booking');

const router = express.Router();

// ดึงข้อมูลทั้งหมด
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// เพิ่มข้อมูล booking ใหม่
router.post('/', async (req, res) => {
  const { bookingId, customerName, details, startDate, endDate, status } = req.body;

  const newBooking = new Booking({ bookingId, customerName, details, startDate, endDate, status });

  try {
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
