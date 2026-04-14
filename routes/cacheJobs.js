const express = require("express");
const axios = require("axios");
const Job = require("../models/Job");

const router = express.Router();

// 🔥 REFRESH ROUTE
router.get("/refresh", async (req, res) => {
  try {
    const response = await axios.get("https://remotive.com/api/remote-jobs");

    const jobs = response.data.jobs.slice(0, 50);

    await Job.deleteMany();

    const formatted = jobs.map((job) => ({
      jobId: job.id,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      url: job.url,
    }));

    await Job.insertMany(formatted);

    res.json({ message: "Jobs cached successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// 🔥 GET ROUTE
router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

module.exports = router;