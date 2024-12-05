// routes/vehicleRoutes.js
const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

// GET - รับข้อมูลทั้งหมดจาก MongoDB
router.get('/', async (req, res) => {
  try {
    const vehicles = await Resource.find({ type: 'Vehicles' });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - เพิ่มข้อมูลรถยนต์
router.post('/', async (req, res) => {
  const { name, category, plateNumber, capacity, status, maintenanceDate, image } = req.body;

  const vehicle = new Resource({
    name,
    type: 'Vehicles', // กำหนดประเภทเป็น "Vehicles"
    category,
    plateNumber,
    capacity,
    status,
    maintenanceDate,
    image,
  });

  try {
    const newVehicle = await vehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - อัปเดตข้อมูลรถยนต์
router.put('/:id', async (req, res) => {
  try {
    const vehicle = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - ลบข้อมูลรถยนต์
router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
