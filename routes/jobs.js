// const express = require("express");
// const axios = require("axios");

// const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const search = req.query.q || ""; // 🔍 search keyword

//     // 🌍 REMOTIVE (WORLDWIDE)
//     const remotiveRes = await axios.get(
//       `https://remotive.com/api/remote-jobs?search=${search}`
//     );

//     const remotiveJobs = remotiveRes.data.jobs.map((job) => ({
//       id: job.id,
//       title: job.title,
//       company: job.company_name,
//       location: job.candidate_required_location,
//       url: job.url,
//     }));

//     // 🇮🇳 ADZUNA (INDIA)
//     let adzunaJobs = [];

//     try {
//       const adzunaRes = await axios.get(
//         `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=5c76b78f&app_key=39c7ff0ab7cdfe8240d37ed495b08725&q=${search}&results_per_page=50`
//       );

//       adzunaJobs = adzunaRes.data.results.map((job) => ({
//         id: job.id,
//         title: job.title,
//         company: job.company?.display_name,
//         location: job.location?.display_name,
//         url: job.redirect_url,
//       }));

//     } catch (err) {
//       console.log("Adzuna error:", err.message);
//     }

//     // 🔥 COMBINE BOTH
//     const allJobs = [...adzunaJobs, ...remotiveJobs];

//     res.json(allJobs);

//   } catch (err) {
//     console.log("FETCH ERROR:", err);
//     res.status(500).json({ message: "Error fetching jobs" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ⭐ SAVE JOB
router.post("/save", async (req, res) => {
  try {
    const { email, job } = req.body;

    if (!email || !job) {
      return res.status(400).json({ message: "Missing data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        savedJobs: [],
        appliedJobs: [],
      });
    }

    const jobId = job.id;

    // prevent duplicate
    const exists = user.savedJobs.find(j => j.jobId === jobId);

    if (exists) {
      return res.json({ message: "Already saved" });
    }

    user.savedJobs.push({
      jobId,
      title: job.title,
      company: job.company, // ✅ FIX
    });

    await user.save();

    res.json({ message: "Job saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ APPLY JOB
router.post("/apply", async (req, res) => {
  try {
    const { email, job } = req.body;

    if (!email || !job) {
      return res.status(400).json({ message: "Missing data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        savedJobs: [],
        appliedJobs: [],
      });
    }

    const jobId = job.id;

    user.appliedJobs.push({
      jobId,
      title: job.title,
      company: job.company, // ✅ FIX
    });

    await user.save();

    res.json({ message: "Applied successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


// 📥 GET SAVED
router.get("/saved/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user?.savedJobs || []);
});

// 📥 GET APPLIED
router.get("/applied/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user?.appliedJobs || []);
});


// ❌ DELETE SAVED
router.post("/delete-saved", async (req, res) => {
  const { email, jobId } = req.body;

  const user = await User.findOne({ email });

  user.savedJobs = user.savedJobs.filter(j => j.jobId !== jobId);
  await user.save();

  res.json({ message: "Deleted" });
});

// ❌ DELETE APPLIED
router.post("/delete-applied", async (req, res) => {
  const { email, jobId } = req.body;

  const user = await User.findOne({ email });

  user.appliedJobs = user.appliedJobs.filter(j => j.jobId !== jobId);
  await user.save();

  res.json({ message: "Deleted" });
});

module.exports = router;