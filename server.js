const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ ROUTES IMPORT
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const jobFetchRoutes = require("./routes/jobFetch");
const cacheJobs = require("./routes/cacheJobs");

// 🔥 CORS (VERY IMPORTANT)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jobico.netlify.app",
    "https://jobico.vercel.app" // 👉 replace with your Vercel URL
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

// 🔥 BODY PARSER
app.use(express.json());

// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/alljobs", jobFetchRoutes);
app.use("/api/jobs-cache", cacheJobs); // ✅ CORRECT PLACE

// 🔥 DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("Jobico Backend Running 🚀");
});

// 🔥 SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});