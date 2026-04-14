const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const search = req.query.q || "developer";

    console.log("SEARCH:", search);

    // 🌍 REMOTIVE
    const remotiveRes = await axios.get(
      `https://remotive.com/api/remote-jobs?search=${search}`
    );

    const remotiveJobs = remotiveRes.data.jobs || [];

    // 🇮🇳 ADZUNA
    let adzunaJobs = [];

    try {
      const adzunaRes = await axios.get(
        "https://api.adzuna.com/v1/api/jobs/in/search/1",
        {
          params: {
            app_id: "5c76b78f",
            app_key: "39c7ff0ab7cdfe8240d37ed495b08725",
            what: search,
            results_per_page: 20,
          },
        }
      );

      adzunaJobs = adzunaRes.data.results || [];

    } catch (err) {
      console.log("Adzuna error:", err.message);
    }

    // 🔥 NORMALIZE DATA (VERY IMPORTANT)
    const allJobs = [
      ...adzunaJobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company?.display_name || "Unknown",
        location: job.location?.display_name || "India",
        url: job.redirect_url,
      })),

      ...remotiveJobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location,
        url: job.url,
      })),
    ];

    console.log("TOTAL JOBS:", allJobs.length);

    res.json(allJobs);

  } catch (err) {
    console.log("MAIN ERROR:", err.message);
    res.json([]); // NEVER FAIL FRONTEND
  }
});

module.exports = router;