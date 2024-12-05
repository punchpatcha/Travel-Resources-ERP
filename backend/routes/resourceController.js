const Resource = require("../model/Resource");
const fs = require('fs');
const path = require('path');

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
    if (req.body.image && req.body.image.startsWith('data:image/')) {
      // แยก base64 data และนามสกุลไฟล์
      const base64Data = req.body.image.split(',')[1];
      const fileExtension = req.body.image.split(';')[0].split('/')[1];
      const fileName = `${Date.now()}.${fileExtension}`;
      req.body.image = fileName; // เก็บเฉพาะชื่อไฟล์แทน path

      const uploadPath = path.join(__dirname, 'uploads');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // เขียนไฟล์ลงในโฟลเดอร์ uploads
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(path.join(uploadPath, fileName), buffer);
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
      const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (err) {
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