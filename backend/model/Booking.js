//backend\model\Booking.js
const mongoose = require("mongoose");

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
  details: [
    {
      type: String, // 'Vehicle', 'Equipment', 'Staff'
      name: String, // เช่น Toyota, Canon mark III, Punch
      category: String, // เช่น Car, Camera (หรือ role สำหรับ Staff)
      quantity: { type: Number, default: 1 }, // จำนวน (เฉพาะ Equipment)
      status: { type: String, enum: ["Available", "Booked", "In Use"], default: "Available" }, // Status
      placeNumber: { type: String }, // เฉพาะ Vehicle
      capacity: { type: Number }, // เฉพาะ Vehicle
      role: { type: String }, // สำหรับ Staff
      contact: { type: String }, // เฉพาะ Staff
      lastAssignment: { type: Date }, // เฉพาะ Staff
    },
  ],
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
    enum: ["Returned", "Booked", "In Use", "Canceled", "Pending"],
    default: "Pending",
  },
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
