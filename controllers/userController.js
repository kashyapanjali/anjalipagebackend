const User = require("../models/User");
const path = require("path");
const fs = require("fs");

// Pass Socket.io instance from `server.js`
let ioInstance;

// Function to initialize Socket.io
const initializeSocket = (io) => {
  ioInstance = io;
};

// Get profile (public route)
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile picture (admin only)
const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = "uploads";
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const profilePicPath = req.file.path;
    const profilePicUrl = `http://localhost:5000/${profilePicPath}`;

    // Find or create the user document
    let user = await User.findOne();
    if (!user) {
      user = new User();
    }

    // Delete old profile picture if exists
    if (user.profilePic) {
      const oldPath = user.profilePic.replace("http://localhost:5000/", "");
      const fullOldPath = path.join(__dirname, "..", oldPath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
      }
    }

    user.profilePic = profilePicUrl;
    await user.save();

    // Emit event to update profile in real-time
    if (ioInstance) {
      ioInstance.emit("profileUpdated", { profilePic: profilePicUrl });
    }

    res.json({
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add certificate (admin only)
const addCertificate = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = new User();
    }

    const { category, link } = req.body;

    // Validate category
    const validCategories = ["Internship", "Course", "Completion"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category. Must be one of: Internship, Course, Completion",
      });
    }

    // Create new certificate
    const newCertificate = {
      category,
      link,
    };

    // Add certificate to array
    user.certificates.push(newCertificate);
    await user.save();

    // Emit event to notify users about new certificates
    if (ioInstance) {
      ioInstance.emit("certificateAdded", { certificates: user.certificates });
    }

    res.status(201).json({
      message: `${category} certificate added successfully`,
      certificates: user.certificates,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Add skills (admin only)
const addSkills = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = new User();
    }

    const { category, skills } = req.body;

    // Validate category
    const validCategories = ["frontend", "backend", "database", "tools"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category. Must be one of: frontend, backend, database, tools",
      });
    }

    // Validate skills array
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills must be an array" });
    }

    // Add new skills without duplicates
    user.skills[category] = [...new Set([...user.skills[category], ...skills])];
    await user.save();

    // Emit event to update skills in real-time
    if (ioInstance) {
      ioInstance.emit("skillsUpdated", { skills: user.skills });
    }

    res.json({
      message: `${category} skills added successfully`,
      skills: user.skills[category],
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Export functions and socket initializer
module.exports = {
  getProfile,
  updateProfilePic,
  addCertificate,
  addSkills,
  initializeSocket,
};
