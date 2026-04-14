// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // ⭐ Saved Jobs
  savedJobs: [
    {
      jobId: String,
      title: String,
      company: String,
    }
  ],

  // ✅ Applied Jobs
  appliedJobs: [
    {
      jobId: String,
      title: String,
      company: String,
    }
  ]
});

module.exports = mongoose.model("User", userSchema);