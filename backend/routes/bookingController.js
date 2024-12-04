// routes/bookingController.js
const Booking = require('../model/Booking');
const Resource = require("../model/Resource");
const mongoose = require('mongoose');

exports.createBooking = async (req, res) => {
  let { details } = req.body;
  // แปลงรายละเอียดจาก JSON string เป็น array ของ objects
  details = JSON.parse(details);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Received booking details:', details);

    const booking = new Booking(req.body);
    await booking.save({ session });
    console.log('Booking created:', booking);

    for (let item of details) {
      console.log('Processing item:', item);

      // ใช้ new mongoose.Types.ObjectId เพื่อแปลง _id จาก string เป็น ObjectId
      const resourceId = new mongoose.Types.ObjectId(item._id);
      const resource = await Resource.findOne({ _id: resourceId }).session(session);
      console.log('Found resource:', resource);

      if (resource) {
        if (resource.type === "Equipment" && resource.availableUnits >= item.quantity) {
          resource.status = "Booked";
          resource.availableUnits -= item.quantity;
          console.log(`Updated resource: ${resource.name}, availableUnits: ${resource.availableUnits}`);
          
          await resource.save({ session });
        } else {
          throw new Error(`Insufficient units available for resource ${item.name}`);
        }
      } else {
        console.log('Resource not found:', item._id);
        throw new Error(`Resource ${item._id} not found`);
      }
    }

    await session.commitTransaction();
    console.log('Transaction committed successfully');
    res.status(201).json(booking);
  } catch (err) {
    console.error('Error occurred:', err.message);
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};


exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingId: req.params.id });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.updateBooking = async (req, res) => {
  let { id } = req.params;
  const { customerName, startDate, endDate, status, details } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id) && !/^[A-Z]{2}-\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid bookingId format' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Updating booking with ID:', id);

    const booking = await Booking.findOne({ bookingId: id }).session(session);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    console.log('Booking found:', booking);

    // Reverting the original resources
    const originalDetails = JSON.parse(booking.details || '[]');
    for (let item of originalDetails) {
      const resource = await Resource.findOne({ _id: item._id }).session(session);
      console.log('Reverting resource:', resource);

      if (resource) {
        if (resource.type === "Equipment") {
          // Reverting only if resource type is Equipment
          resource.availableUnits += item.quantity;
          resource.status = "Available"; // Reverting status as well if needed
          console.log(`Reverted resource: ${resource.name}, availableUnits: ${resource.availableUnits}`);
          await resource.save({ session });
        }
      } else {
        console.log('Resource not found for reverting:', item._id);
        throw new Error(`Resource ${item._id} not found for reverting`);
      }
    }

    // Processing new resources for the updated booking
    for (let item of JSON.parse(details || '[]')) {
      const resource = await Resource.findOne({ _id: item._id }).session(session);
      console.log('Processing new resource:', resource);

      if (resource) {
        if (resource.type === "Equipment" && resource.availableUnits >= item.quantity) {
          resource.status = "Booked";
          resource.availableUnits -= item.quantity;
          console.log(`Updated resource: ${resource.name}, availableUnits: ${resource.availableUnits}`);
          await resource.save({ session });
        } else if (resource.type !== "Equipment") {
          // Only update status for non-Equipment types
          resource.status = "Booked";
          console.log(`Updated status for resource: ${resource.name}`);
          await resource.save({ session });
        } else {
          throw new Error(`Insufficient units available for resource ${item.name}`);
        }
      } else {
        console.log('Resource not found:', item._id);
        throw new Error(`Resource ${item._id} not found`);
      }
    }

    booking.customerName = customerName;
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.status = status;
    booking.details = details;

    await booking.save({ session });
    await session.commitTransaction();
    console.log('Transaction committed successfully');
    res.json(booking);
  } catch (err) {
    console.error('Error occurred:', err.message);
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};


  
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findOne({ bookingId: id }).session(session);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    let details = [];
    try {
      details = JSON.parse(booking.details[0]);
    } catch (err) {
      console.error('Error parsing booking details:', err);
      return res.status(400).json({ error: "Invalid details format" });
    }

    for (let item of details) {
      if (!item.name) {
        console.log('Item name is missing:', item);
        continue;
      }

      const resource = await Resource.findOne({ name: item.name, category: item.category }).session(session);
      if (resource) {
        resource.status = "Available";
        if (resource.type === "Equipment") {
          resource.availableUnits += item.quantity;
        }
        await resource.save({ session });
      }
    }

    await Booking.findOneAndDelete({ bookingId: id }).session(session);
    await session.commitTransaction();
    res.status(200).json({ message: "Booking deleted successfully and related resources updated" });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};

