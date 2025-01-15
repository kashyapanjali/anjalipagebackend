const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateProfilePic,
    addProject,
    updateSkills,
    addCertificate
} = require('../controllers/userController');

router.get('/:id', getUserProfile);
router.put('/:id/profile-pic', updateProfilePic);
router.post('/:id/projects', addProject);
router.put('/:id/skills', updateSkills);
router.post('/:id/certificates', addCertificate);

module.exports = router;