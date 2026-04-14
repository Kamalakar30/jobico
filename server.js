const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express(); // ✅ FIRST create app

// routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const jobFetchRoutes = require("./routes/jobFetch"); // ✅ FIXED

// 🔥 CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

// 🔥 BODY PARSER
app.use(express.json());

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alljobs", jobFetchRoutes); // ✅ AFTER app created

// 🔥 DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// 🔥 TEST
app.get("/", (req, res) => {
  res.send("Jobico Backend Running 🚀");
});

// 🔥 SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});