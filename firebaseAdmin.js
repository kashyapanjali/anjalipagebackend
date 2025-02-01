const admin = require("firebase-admin");
// const path = require("path");

// Correctly reference the service account key file in the backend root folder
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
