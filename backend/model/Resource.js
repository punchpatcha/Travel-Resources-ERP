const mongoose = require("mongoose");

// สร้าง Schema สำหรับ Resource (รถ, อุปกรณ์, พนักงาน)
const ResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Vehicle", "Equipment", "Staff"], // ประเภทหลัก
      required: true,
    },
    category: {
      type: String, // เก็บชื่อ category แบบไดนามิก เช่น "Car", "Van", "Bus"
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Booked", "In Use", "Maintenance", "Unavailable"],
      default: "Available",
    },
    lastUsed: {
      type: Date,
      required: function () {
        return this.type === "Vehicle" || this.type === "Equipment";
      },
    },

    // เฉพาะ Vehicle
    placeNumber: {
      type: String,
      required: function () {
        return this.type === "Vehicle";
      },
    },
    capacity: {
      type: Number,
      required: function () {
        return this.type === "Vehicle";
      },
    },
    maintenanceDate: {
      type: Date, // วันที่กำหนดบำรุงรักษา
    },
    // เฉพาะ Equipment
    availableUnits: {
      type: Number,
      required: function () {
        return this.type === "Equipment";
      },
    },
    totalUnits: {
      type: Number,
      required: function () {
        return this.type === "Equipment";
      },
    },
    // เฉพาะ Staff
    role: {
      type: String,
      required: function () {
        return this.type === "Staff";
      },
    },
    contact: {
      type: String,
      required: function () {
        return this.type === "Staff";
      },
    },
    lastAssignment: {
      type: Date,
      required: function () {
        return this.type === "Staff";
      },
    },
    image: {
      type: String,
      required: false,
    },
  },
  { collection: "resourceCollection" } // กำหนดชื่อ Collection เอง
);

const Resource = mongoose.model("Resource", ResourceSchema);

module.exports = Resource;
