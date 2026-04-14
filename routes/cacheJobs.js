const express = require("express");
const axios = require("axios");
const Job = require("../models/Job");

const router = express.Router();

router.get("/refresh", async (req, res) => {
  try {
    let jobs = [];

    // 🌍 REMOTIVE
    try {
      const remotiveRes = await axios.get("https://remotive.com/api/remote-jobs");

      const remotiveJobs = remotiveRes.data.jobs || [];

      jobs.push(
        ...remotiveJobs.map(j => ({
          jobId: "rem-" + j.id,
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location,
          url: j.url,
        }))
      );

    } catch (err) {
      console.log("Remotive failed:", err.message);
    }

    // 🇮🇳 ADZUNA
    try {
      const adzunaRes = await axios.get(
        "https://api.adzuna.com/v1/api/jobs/in/search/1",
        {
          params: {
            app_id: "5c76b78f",
            app_key: "39c7ff0ab7cdfe8240d37ed495b08725",
            what: "developer",
            results_per_page: 50,
          },
        }
      );

      const adzunaJobs = adzunaRes.data.results || [];

      jobs.push(
        ...adzunaJobs.map(j => ({
          jobId: "adz-" + j.id,
          title: j.title,
          company: j.company?.display_name || "Unknown",
          location: j.location?.display_name || "India",
          url: j.redirect_url,
        }))
      );

    } catch (err) {
      console.log("Adzuna failed:", err.message);
    }

    // 🔥 SAVE
    await Job.deleteMany();
    await Job.insertMany(jobs);

    res.json({
      message: "Jobs cached",
      total: jobs.length,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

module.exports = router;