const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
    updateProfilePic,
    addProject,
    updateSkills,
    addCertificate
} = require('../controllers/userController');

// Make sure only admin can update profile
router.put('/admin/profile-pic', adminAuth, upload.single('profilePic'), updateProfilePic);
router.post('/:id/projects', addProject);
router.put('/:id/skills', updateSkills);
router.post('/:id/certificates', addCertificate);

module.exports = router;