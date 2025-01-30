const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const { CLIENT_RENEG_LIMIT } = require("tls");
let ioInstance;

// Initialize WebSocket
const initializeSocket = (io) => {
  ioInstance = io;
};

// **GET Portfolio Data (For All Users)**
const getPortfolio = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json({
      profilePic: user.profilePic,
      skills: user.skills,
      certificates: user.certificates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Update Profile Picture (Admin Only)**
const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const profilePicUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    let user = await User.findOne();
    if (!user) {
      user = new User({ profilePic: profilePicUrl, skills: {}, certificates: [] });
    } else {
      // Delete old profile pic if exists
      if (user.profilePic) {
        const oldPath = path.join(__dirname, "..", "uploads", path.basename(user.profilePic));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profilePic = profilePicUrl;
    }

    await user.save();

    // **Emit real-time update to all users**
    ioInstance?.emit("portfolioUpdated", { profilePic: user.profilePic, skills: user.skills, certificates: user.certificates });

    res.json({ message: "Profile updated successfully", profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// **Add Certificate (Admin Only)**
const addCertificate = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) user = new User({ skills: {}, certificates: [] });

    const { category, link } = req.body;

    if (!["Internship", "Course", "Completion"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    user.certificates.push({ category, link });
    await user.save();

    // **Notify all users of changes**
    ioInstance?.emit("portfolioUpdated", { profilePic: user.profilePic, skills: user.skills, certificates: user.certificates });

    res.json({ message: "Certificate added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// **Add Skills (Admin Only)**
const addSkills = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) user = new User({ skills: {}, certificates: [] });

    const { category, skills } = req.body;

    if (!["frontend", "backend", "database", "tools"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    user.skills[category] = [...new Set([...user.skills[category], ...skills])];
    await user.save();

    // **Emit real-time updates**
    ioInstance?.emit("portfolioUpdated", { profilePic: user.profilePic, skills: user.skills, certificates: user.certificates });

    res.json({ message: "Skills added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const test1=async(req,res)=>{
  console.log("result");
  return res.status(200).json(req.body);
}


module.exports = {
  initializeSocket,
  getPortfolio,
  updateProfilePic,
  addCertificate,
  addSkills,
  test1
};
