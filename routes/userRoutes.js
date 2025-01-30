const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  updateProfilePic,
  addCertificate,
  getProfile,
  addSkills,
} = require("../controllers/userController");

// Public route - Get user profile
router.get("/profile", getProfile);

// Admin-only route - Update profile picture
router.put("/admin/profile-pic", adminAuth, upload.single("profilePic"), updateProfilePic);

// Admin-only route - Add new skills
router.post("/admin/skills", adminAuth, addSkills);

// Admin-only route - Add new certificates
router.post("/admin/certificates", adminAuth, addCertificate);

module.exports = router;
