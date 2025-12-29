
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  patientId: String,
  patientName: String,
  age: Number,
  gender: String,
  referredBy: String,
  tests: [{ testName: String, price: Number }],
  totalAmount: Number,
  discount: Number,
  netAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Registration", schema);
