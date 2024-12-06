//backend\routes\resourceController.js
const Resource = require("../model/Resource");
const fs = require("fs");
const path = require("path");

// Get all resources or filter by query
exports.getResources = async (req, res) => {
  try {
    const filters = req.query || {};
    const resources = await Resource.find(filters);
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new resource
exports.createResource = async (req, res) => {
  try {
    if (req.body.image && req.body.image.startsWith("data:image/")) {
      // แยก base64 data และนามสกุลไฟล์
      const base64Data = req.body.image.split(",")[1];
      const fileExtension = req.body.image.split(";")[0].split("/")[1];
      const fileName = `${Date.now()}.${fileExtension}`;
      req.body.image = fileName; // เก็บเฉพาะชื่อไฟล์แทน path

      const uploadPath = path.join(__dirname, "../routes/uploads"); 
      console.log("File will be saved to:", uploadPath);

      if (!fs.existsSync(uploadPath)) {
        console.log(`Creating directory: ${uploadPath}`);
        fs.mkdirSync(uploadPath, { recursive: true });
      } else {
        console.log(`Directory already exists: ${uploadPath}`);
      }

      // เขียนไฟล์ลงในโฟลเดอร์ uploads
      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(path.join(uploadPath, fileName), buffer);
      console.log(`File saved as: ${fileName}`);
    }

    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a resource by ID
exports.updateResource = async (req, res) => {
  try {
    let updatedData = req.body;
    const resourceId = req.params.id;

    // ดึงข้อมูล resource ปัจจุบันจากฐานข้อมูล
    const currentResource = await Resource.findById(resourceId);

    if (!currentResource) {
      return res.status(404).json({ error: "Resource not found" });
    }


    // ตรวจสอบการอัปโหลดไฟล์ใหม่หรือไม่
    if (req.body.image && req.body.image.startsWith("data:image/")) {
      const base64Data = req.body.image.split(",")[1];
      const fileExtension = req.body.image.split(";")[0].split("/")[1];
      const fileName = `${Date.now()}.${fileExtension}`;

      const uploadPath = path.join(__dirname, "../routes/uploads");

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const buffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(path.join(uploadPath, fileName), buffer);

      updatedData.image = fileName;
    }

    const resource = await Resource.findByIdAndUpdate(resourceId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    console.error("Error during resource update:", err);
    res.status(400).json({ error: err.message });
  }
};


// Delete a resource by ID
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json({ message: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//ดึง resource ตาม id ที่เลือก
exports.getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
