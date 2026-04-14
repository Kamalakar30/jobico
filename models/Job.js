const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobId: String,
  title: String,
  company: String,
  location: String,
  url: String,
});

module.exports = mongoose.model("Job", jobSchema);