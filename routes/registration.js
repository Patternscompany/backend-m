const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");
const generatePDF = require("../utils/pdf");
const path = require("path");
const fs = require("fs");

router.post("/", async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    const patientId = "VAMD" + (count + 1).toString().padStart(5, "0");

    const registration = new Registration({ ...req.body, patientId });
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/pdf", async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Not found" });

    const billsDir = path.join(__dirname, "../bills");
    if (!fs.existsSync(billsDir)) {
      fs.mkdirSync(billsDir);
    }

    const filePath = generatePDF(registration);

    // Wait for file to be written
    setTimeout(() => {
      res.download(path.join(__dirname, "..", filePath));
    }, 500);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
