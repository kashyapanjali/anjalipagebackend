const adminAuth = (req, res, next) => {
    const adminKey = req.headers['admin-key'];
    
    // Your personal secret key
    if (adminKey === process.env.ADMIN_SECRET) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
};

module.exports = adminAuth; 