const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/authMiddleware"); // Ensure this middleware exists
const upload = require("../middleware/upload");
const {
  getPortfolio,
  updateProfilePic,
  addCertificate,
  addSkills,
  test1
} = require("../controllers/userController");

// **Public Route: Get Portfolio Data (Read-Only)**
router.get("/portfolio", getPortfolio);

// **Admin-Only Routes**
router.put("/admin/profile-pic", adminAuth, upload.single("profilePic"), updateProfilePic);
router.post("/admin/skills", adminAuth, addSkills);
router.post("/admin/certificates", adminAuth, addCertificate);

router.get("/admin-dashboard", adminAuth, (req, res) => {
  console.log("Received token:", req.headers.authorization);
  res.json({ message: `Welcome, Admin ${req.user.email}!` });
});


// test api
router.post("/admin/test1",test1);

module.exports = router;
