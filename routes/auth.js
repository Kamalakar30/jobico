const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      savedJobs: [],
      appliedJobs: [],
    });

    await user.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

module.exports = router;