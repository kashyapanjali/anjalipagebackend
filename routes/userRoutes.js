const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
    updateProfilePic,
    addCertificate,
    getProfile,
    addCompletedProject,
    updateOngoingProject,
    getProjects,
    addSkills
} = require('../controllers/userController');

// Public route - anyone can view
router.get('/profile', getProfile);
router.put('/admin/profile-pic', adminAuth, upload.single('profilePic'), updateProfilePic);
router.post('/:id/certificates', addCertificate);

// All routes are admin-protected
router.get('/admin/projects', adminAuth, getProjects);
router.post('/admin/projects/completed', adminAuth, addCompletedProject);
router.put('/admin/projects/ongoing', adminAuth, updateOngoingProject);

// Admin route for adding skills
router.post('/admin/skills', adminAuth, addSkills);

// Admin route for adding certificates
router.post('/admin/certificates', adminAuth, addCertificate);

module.exports = router;