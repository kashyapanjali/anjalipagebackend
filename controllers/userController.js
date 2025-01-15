const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update profile picture
const updateProfilePic = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profilePic: req.body.profilePic },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add project
const addProject = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.projects.push(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update skills
const updateSkills = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { skills: req.body },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add certificate
const addCertificate = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.certificates.push(req.body);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateProfilePic,
    addProject,
    updateSkills,
    addCertificate
};