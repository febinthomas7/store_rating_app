require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Database Connection
const db = require("./config/db.js");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/adminRoutes.js");
const storeRoutes = require("./routes/storeRoutes");
const users = require("./routes/user.js");

// const ratingRoutes = require("./src/routes/ratingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGINS || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", userRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/users", users);
// app.use("/api/ratings", ratingRoutes);

// Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
