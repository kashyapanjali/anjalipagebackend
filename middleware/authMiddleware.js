const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const adminEmails = ["anjali.official7061@gmail.com"]; // List of valid admin emails

const adminAuth = async (req, res, next) => {
  const { email, password } = req.body; // Get email and password from request body

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if the email is in the admin emails list
  if (!adminEmails.includes(email)) {
    return res.status(403).json({ message: "Unauthorized access: Not an admin" });
  }

  try {
    // Use Firebase Authentication to sign in the admin
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if user is authenticated
    const user = userCredential.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access: Invalid credentials" });
    }

    // Attach user info to request for use in subsequent routes
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error during Firebase Authentication:", error);

    // Handle different Firebase errors
    if (error.code === "auth/wrong-password") {
      return res.status(401).json({ message: "Unauthorized access: Invalid password" });
    } else if (error.code === "auth/user-not-found") {
      return res.status(401).json({ message: "Unauthorized access: Invalid email" });
    }

    return res.status(401).json({ message: "Unauthorized access: Invalid email or password" });
  }
};

module.exports = adminAuth;
