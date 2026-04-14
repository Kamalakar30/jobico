const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const search = req.query.q || "developer";

  try {
    // 🔥 run both APIs in parallel (FAST)
    const [remotiveRes, adzunaRes] = await Promise.allSettled([
      axios.get(`https://remotive.com/api/remote-jobs?search=${search}`),
      axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
        params: {
          app_id: "5c76b78f",
          app_key: "39c7ff0ab7cdfe8240d37ed495b08725",
          what: search,
          results_per_page: 50,
        },
      }),
    ]);

    let jobs = [];

    // ✅ REMOTIVE
    if (remotiveRes.status === "fulfilled") {
      const remotiveJobs = remotiveRes.value.data.jobs || [];

      jobs.push(
        ...remotiveJobs.map((job) => ({
          id: "remotive-" + job.id,
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location,
          url: job.url,
        }))
      );
    }

    // ✅ ADZUNA
    if (adzunaRes.status === "fulfilled") {
      const adzunaJobs = adzunaRes.value.data.results || [];

      jobs.push(
        ...adzunaJobs.map((job) => ({
          id: "adzuna-" + job.id,
          title: job.title,
          company: job.company?.display_name || "Unknown",
          location: job.location?.display_name || "India",
          url: job.redirect_url,
        }))
      );
    }

    // 🔥 IMPORTANT: never send empty silently
    if (jobs.length === 0) {
      return res.status(500).json({ message: "No jobs from APIs" });
    }

    res.json(jobs);

  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;