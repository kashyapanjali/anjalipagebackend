const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
    updateProfilePic,
    addCertificate,
    getProfile,
    addCompletedProject,
    addOngoingProject,
    updateOngoingProject,
    getProjects,
    addSkills
} = require('../controllers/userController');

// Public route - anyone can view
router.get('/profile', getProfile);
router.put('/admin/profile-pic', adminAuth, upload.single('profilePic'), updateProfilePic);

// router.post('/:id/certificates', addCertificate);

// Admin-protected project routes
router.get('/admin/projects', adminAuth, getProjects); 
// Get all projects
router.post('/admin/projects/completed', adminAuth, addCompletedProject); // Add completed project
router.post('/admin/projects/ongoing', adminAuth, addOngoingProject); // Add ongoing project
router.put('/admin/projects/ongoing/:id', adminAuth, updateOngoingProject); // Update ongoing project


// Admin route for adding skills
router.post('/admin/skills', adminAuth, addSkills);

// Admin route for adding certificates
router.post('/admin/certificates', adminAuth, addCertificate);

module.exports = router;