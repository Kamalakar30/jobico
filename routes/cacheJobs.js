const express = require("express");
const axios = require("axios");
const Job = require("../models/Job");

const router = express.Router();

// 🔥 REFRESH JOBS (India + Remote)
router.get("/refresh", async (req, res) => {
  try {
    let jobs = [];

    // 🌍 REMOTIVE (USA/REMOTE)
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
      console.log("Remotive error:", err.message);
    }

    // 🇮🇳 ADZUNA (INDIA - MULTIPLE PAGES)
    try {
      let adzunaJobs = [];

      for (let i = 1; i <= 3; i++) { // 🔥 3 pages
        const res = await axios.get(
          `https://api.adzuna.com/v1/api/jobs/in/search/${i}`,
          {
            params: {
              app_id: "5c76b78f",
              app_key: "39c7ff0ab7cdfe8240d37ed495b08725",
              what: "software developer",
            },
          }
        );

        adzunaJobs.push(...res.data.results);
      }

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
      console.log("Adzuna error:", err.message);
    }

    // 🔥 SAVE TO DB
    await Job.deleteMany();
    await Job.insertMany(jobs);

    res.json({
      message: "Jobs cached successfully",
      total: jobs.length,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// 🔥 GET JOBS
router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

module.exports = router;