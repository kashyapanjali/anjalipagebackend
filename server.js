require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { initializeSocket } = require("./controllers/userController");

const app = express();
const server = http.createServer(app); // Create HTTP server for WebSocket support
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Store io instance in the app for access in controllers
app.set("io", io);

// Connect to database
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Uploads directory created successfully");
  } catch (err) {
    console.error("Error creating uploads directory:", err);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// Initialize WebSocket in controllers
initializeSocket(io);

// Use routes
app.use("/api/users", userRoutes);

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
