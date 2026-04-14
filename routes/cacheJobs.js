router.get("/refresh", async (req, res) => {
  try {
    const [remotiveRes, adzunaRes] = await Promise.all([
      axios.get("https://remotive.com/api/remote-jobs"),
      axios.get("https://api.adzuna.com/v1/api/jobs/in/search/1", {
        params: {
          app_id: "5c76b78f",
          app_key: "39c7ff0ab7cdfe8240d37ed495b08725",
          results_per_page: 50,
        },
      }),
    ]);

    const remotiveJobs = remotiveRes.data.jobs || [];
    const adzunaJobs = adzunaRes.data.results || [];

    await Job.deleteMany();

    const jobs = [
      ...remotiveJobs.map(j => ({
        jobId: "rem-" + j.id,
        title: j.title,
        company: j.company_name,
        location: j.candidate_required_location,
        url: j.url,
      })),

      ...adzunaJobs.map(j => ({
        jobId: "adz-" + j.id,
        title: j.title,
        company: j.company?.display_name,
        location: j.location?.display_name,
        url: j.redirect_url,
      })),
    ];

    await Job.insertMany(jobs);

    res.json({ message: "Jobs cached (India + Remote)" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching jobs" });
  }
});