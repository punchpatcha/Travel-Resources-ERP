const express = require("express");
const multer = require("multer");
const path = require("path");
const Resource = require("../model/Resource");

const router = express.Router();

// การดึงข้อมูลทั้งหมดจาก MongoDB
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find(); // ดึงข้อมูลทั้งหมดจาก resourceCollection
    res.json(resources); // ส่งข้อมูลกลับในรูปแบบ JSON
  } catch (error) {
    res.status(400).json({ message: error.message }); // ถ้ามีข้อผิดพลาด
  }
});

// ตั้งค่า multer สำหรับอัปโหลดไฟล์ภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// API สำหรับสร้าง Resource
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      type,
      category,
      status,
      lastUsed,
      placeNumber,
      capacity,
      maintenanceDate,
      availableUnits,
      totalUnits,
      role,
      contact,
      lastAssignment,
    } = req.body;

    // ตรวจสอบประเภทของ Resource
    let resourceData = { name, type, category, status };

    if (type === "Vehicle") {
      if (!placeNumber || !capacity) throw new Error("Vehicle requires placeNumber and capacity.");
      resourceData = {
        ...resourceData,
        placeNumber,
        capacity,
        lastUsed: lastUsed || null,
        maintenanceDate: maintenanceDate || null,
      };
    } else if (type === "Equipment") {
      if (!availableUnits || !totalUnits) throw new Error("Equipment requires availableUnits and totalUnits.");
      resourceData = {
        ...resourceData,
        availableUnits,
        totalUnits,
        lastUsed: lastUsed || null,
      };
    } else if (type === "Staff") {
      if (!role || !contact || !lastAssignment) throw new Error("Staff requires role, contact, and lastAssignment.");
      resourceData = {
        ...resourceData,
        role,
        contact,
        lastAssignment,
      };
    } else {
      throw new Error("Invalid resource type. Must be Vehicle, Equipment, or Staff.");
    }

    // เพิ่มข้อมูลไฟล์ภาพ หากมีการอัปโหลด
    if (req.file) resourceData.image = req.file.path;

    // สร้าง Resource ใหม่ใน MongoDB
    const newResource = new Resource(resourceData);
    await newResource.save();

    res.status(201).json({ message: "Resource created successfully", resource: newResource });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
