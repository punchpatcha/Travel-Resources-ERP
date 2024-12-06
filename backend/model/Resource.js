// backend\model\Resource.js

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
      enum: ["Vehicles", "Equipment", "Staff"], // ประเภทหลัก
      required: true,
    },
    category: {
      type: String, // เก็บชื่อ category แบบไดนามิก เช่น "Car", "Van", "Bus"
      required: function () {
        return this.type === "Vehicles" || this.type === "Equipment";
      },
    },
    status: {
      type: String,
      enum: ["Available", "Booked", "In Use", "Maintenance", "Unavailable"],
      default: "Available",
    },
    lastUsed: {
      type: Date,
      required: false, // ไม่จำเป็นต้องกรอกข้อมูล
    },
    

    // เฉพาะ Vehicle
    plateNumber: {
      type: String,
      required: function () {
        return this.type === "Vehicles";
      },
    },
    capacity: {
      type: Number,
      required: function () {
        return this.type === "Vehicles";
      },
    },
    maintenanceDate: {
      type: Date, // วันที่กำหนดบำรุงรักษา
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
