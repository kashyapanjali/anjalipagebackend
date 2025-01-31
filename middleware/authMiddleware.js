const admin = require("../firebaseAdmin");

const adminEmails = ["anjali.official7061@gmail.com"]; // List of admin emails

const adminAuth = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization?.split("Bearer ")[1];
    if (!idToken) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Check if the user is an admin based on email
    if (!adminEmails.includes(decodedToken.email)) {
      return res.status(403).json({ message: "Access denied: You are not an admin." });
    }
    req.user = decodedToken; // Attach user data to the request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
  }
};

module.exports = adminAuth;
