// routes/bookingController.js
const Booking = require("../model/Booking");
const Resource = require("../model/Resource");
const mongoose = require("mongoose");

exports.createBooking = async (req, res) => {
  let { details } = req.body;
  // แปลงรายละเอียดจาก JSON string เป็น array ของ objects
  details = JSON.parse(details);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Received booking details:", details);

    const booking = new Booking(req.body);
    await booking.save({ session });
    console.log("Booking created:", booking);

    for (let item of details) {
      console.log("Processing item:", item);

      // ใช้ new mongoose.Types.ObjectId เพื่อแปลง _id จาก string เป็น ObjectId
      const resourceId = new mongoose.Types.ObjectId(item._id);
      const resource = await Resource.findOne({ _id: resourceId }).session(
        session
      );
      console.log("Found resource:", resource);

      if (resource) {
        resource.status = "Booked";

        console.log(
          `Updated resource: ${resource.name}}`
        );

        await resource.save({ session });
      } else {
        throw new Error(
          `Insufficient units available for resource ${item.name}`
        );
      }
    }

    await session.commitTransaction();
    console.log("Transaction committed successfully");
    res.status(201).json(booking);
  } catch (err) {
    console.error("Error occurred:", err.message);
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
      return res.status(404).json({ error: "Booking not found" });
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
    return res.status(400).json({ error: "Invalid bookingId format" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log("Updating booking with ID:", id);

    const booking = await Booking.findOne({ bookingId: id }).session(session);
    if (!booking) {
      throw new Error("Booking not found");
    }
    console.log("Booking found:", booking);

    const originalDetails = JSON.parse(booking.details || "[]");

    // ตรวจสอบว่าควร revert สถานะ Resource หรือไม่
    if (status === "Returned") {
      // ทำการคืนสถานะ Resource ให้เป็น Available
      for (let item of originalDetails) {
        const resource = await Resource.findOne({ _id: item._id }).session(
          session
        );
        console.log(
          `Updated status for resource: ${resource.name}, status: ${resource.status}`
        );

        if (!resource) {
          throw new Error(`Resource ${item._id} not found for reverting`);
        }

       // อัปเดตสถานะและฟิลด์ที่เกี่ยวข้อง
       resource.status = "Available";
       if (resource.type === "Equipment" || resource.type === "Vehicles") {
         resource.lastUsed = new Date(); // บันทึกวันที่ปัจจุบัน
       } else if (resource.type === "Staff") {
         resource.lastAssignment = new Date().toISOString(); // บันทึกวันที่ปัจจุบันในรูปแบบ ISO
       }

       console.log(`Updated resource: ${resource.name}, type: ${resource.type}`);
       await resource.save({ session });
     }
   }

     // สำหรับกรณีที่ไม่ใช่ Returned, อัปเดตสถานะเป็น Booked
     if (status !== "Returned") {
      for (let item of JSON.parse(details || "[]")) {
        const resource = await Resource.findOne({ _id: item._id }).session(
          session
        );
        if (!resource) {
          throw new Error(`Resource ${item._id} not found`);
        }

        resource.status = "Booked";
        console.log(`Updated status for resource: ${resource.name}`);
        await resource.save({ session });
      }
    }

    // อัปเดตข้อมูล Booking
    booking.customerName = customerName;
    booking.startDate = startDate;
    booking.endDate = endDate;
    booking.status = status;
    booking.details = details;

    await booking.save({ session });

    await session.commitTransaction();
    console.log("Transaction committed successfully");
    res.json(booking);
  } catch (err) {
    console.error("Error occurred:", err.message);
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
      console.error("Error parsing booking details:", err);
      return res.status(400).json({ error: "Invalid details format" });
    }

    for (let item of details) {
      if (!item.name) {
        console.log("Item name is missing:", item);
        continue;
      }

      const resource = await Resource.findOne({
        name: item.name,
        category: item.category,
      }).session(session);
      if (resource) {
        resource.status = "Available";
        await resource.save({ session });
      }
    }

    await Booking.findOneAndDelete({ bookingId: id }).session(session);
    await session.commitTransaction();
    res.status(200).json({
      message: "Booking deleted successfully and related resources updated",
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};
