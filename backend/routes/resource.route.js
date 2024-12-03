// routes/resource.route.js
const express = require('express');
const Resource = require('../model/Resource');
const router = express.Router();

// POST: เพิ่ม Resource ใหม่
router.post('/', async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();
        res.status(201).json(resource);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET: ดึง Resource ทั้งหมดหรือกรองด้วย query (เช่น status=Available)
router.get('/', async (req, res) => {
    try {
        const filters = req.query || {};
        const resources = await Resource.find(filters);
        res.json(resources);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// PUT: อัปเดต Resource
router.put('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.json(resource);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE: ลบ Resource
router.delete('/:id', async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }
        res.json({ message: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
