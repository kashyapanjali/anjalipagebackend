const adminAuth = (req, res, next) => {
    const adminKey = req.headers["admin-key"];  // Access the admin key from the headers
    
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET) {  // Check against your secret key
      return res.status(401).json({ message: "Unauthorized access" });
    }
    next();  // If key matches, proceed to the next middleware or route handler
  };
  module.exports = adminAuth;
  