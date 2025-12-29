require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running on Vercel 🚀");
});

mongoose.connect(process.env.MONGO_URI);

app.use("/api/auth", require("../routes/auth"));
app.use("/api/registration", require("../routes/registration"));

app.listen(process.env.PORT || 5000, () => console.log(`Backend running on port ${process.env.PORT || 5000}`));
