const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Get profile (public route)
const getProfile = async (req, res) => {
    try {
        const user = await User.findOne();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update profile pic (admin only)
const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Create uploads directory if it doesn't exist
        const uploadsDir = 'uploads';
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const profilePicPath = req.file.path;
        const profilePicUrl = `http://localhost:5000/${profilePicPath}`;

        // Find or create the single user document
        let user = await User.findOne();
        if (!user) {
            user = new User();
        }

        // Delete old profile picture if exists
        if (user.profilePic) {
            const oldPath = user.profilePic.replace('http://localhost:5000/', '');
            const fullOldPath = path.join(__dirname, '..', oldPath);
            if (fs.existsSync(fullOldPath)) {
                fs.unlinkSync(fullOldPath);
            }
        }

        user.profilePic = profilePicUrl;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};


// Add completed project (admin protected)
const addCompletedProject = async (req, res) => {
    try {
        // Assuming adminAuth middleware verifies if the user is an admin
        let user = await User.findOne();  // Admin should be able to access all users
        if (!user) {
            user = new User();
        }

        const newProject = {
            category: "completed",
            title: req.body.title,
            link: req.body.link,
            description: req.body.description
        };

        user.projects.push(newProject);
        await user.save();

        res.status(201).json({
            message: 'Completed project added successfully',
            user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Add ongoing project (admin protected)
const addOngoingProject = async (req, res) => {
    try {
        // Assuming adminAuth middleware checks the admin status
        let user = await User.findOne();  // Admin should be able to access all users
        if (!user) {
            user = new User();
        }

        const newProject = {
            category: "Ongoing",
            title: req.body.title,
            link: req.body.link,
            description: req.body.description
        };

        // Check if the project already exists in ongoing category
        const existingProject = user.projects.find(project => project.title === req.body.title && project.category === "Ongoing");
        if (existingProject) {
            return res.status(400).json({ message: "Ongoing project with this title already exists." });
        }

        user.projects.push(newProject);
        await user.save();

        res.status(201).json({
            message: 'Ongoing project added successfully',
            user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message });
    }
};
// Update ongoing project (admin protected)
const updateOngoingProject = async (req, res) => {
    try {
        // Assuming adminAuth middleware checks the admin status
        let user = await User.findOne();
        if (!user) {
            user = new User();
        }

        const projectData = {
            category: "Ongoing",
            title: req.body.title,
            link: req.body.link,
            description: req.body.description
        };

        // Find the project in ongoing category
        const existingProjectIndex = user.projects.findIndex(
            project => project.title === req.body.title && project.category === "Ongoing"
        );

        if (existingProjectIndex !== -1) {
            user.projects[existingProjectIndex] = {
                ...user.projects[existingProjectIndex],
                ...projectData
            };
        } else {
            user.projects.push(projectData);
        }

        await user.save();
        res.json({
            message: existingProjectIndex !== -1 ? 'Ongoing project updated' : 'New ongoing project added',
            user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
      // Fetch all projects from the database (modify as per your DB model)
      const ongoingProjects = await Project.find({ category: 'Ongoing' });
      const completedProjects = await Project.find({ category: 'Completed' });
      res.json([...ongoingProjects, ...completedProjects]);  // Merge ongoing and completed projects
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Add certificate
const addCertificate = async (req, res) => {
    try {
        let user = await User.findOne();
        if (!user) {
            user = new User();
        }

        const { category, link } = req.body;

        // Validate category
        const validCategories = ['Internship', 'Course', 'Completion'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                message: 'Invalid category. Must be one of: Internship, Course, Completion' 
            });
        }

        // Create new certificate
        const newCertificate = {
            category,
            link // Optional: link can be undefined
        };

        // Add certificate to array
        user.certificates.push(newCertificate);
        await user.save();

        res.status(201).json({
            message: `${category} certificate added successfully`,
            certificates: user.certificates
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Add skills (admin protected)
const addSkills = async (req, res) => {
    try {
        let user = await User.findOne();
        if (!user) {
            user = new User();
        }

        const { category, skills } = req.body;

        // Validate category
        const validCategories = ['frontend', 'backend', 'database', 'tools'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                message: 'Invalid category. Must be one of: frontend, backend, database, tools' 
            });
        }

        // Validate skills array
        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: 'Skills must be an array' });
        }

        // Add new skills without duplicates
        user.skills[category] = [...new Set([...user.skills[category], ...skills])];
        await user.save();

        res.json({
            message: `${category} skills added successfully`,
            skills: user.skills[category]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfilePic,
    addCompletedProject,
    addOngoingProject,
    updateOngoingProject,
    getProjects,
    addCertificate,
    addSkills
};