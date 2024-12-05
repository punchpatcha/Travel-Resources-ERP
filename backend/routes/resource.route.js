// routes/resource.route.js
const express = require('express');
const router = express.Router();
const resourceController = require("../routes/resourceController");

router.get("/", resourceController.getResources);
router.post("/", resourceController.createResource);
router.put("/:id", resourceController.updateResource);
router.delete("/:id", resourceController.deleteResource);
router.get("/:id", resourceController.getResource);
module.exports = router;