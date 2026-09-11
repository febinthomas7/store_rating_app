require("dotenv").config();
const express = require("express");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
// Database Connection
const db = require("./config/db.js");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/adminRoutes.js");
const storeRoutes = require("./routes/storeRoutes");
const users = require("./routes/user.js");

// const ratingRoutes = require("./src/routes/ratingRoutes");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Stricter Auth Limiter: Protects login/register routes against brute-force (10 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login/auth attempts from this IP, please try again after 15 minutes.",
  },
});

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
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", globalLimiter, userRoutes);
app.use("/api/store", globalLimiter, storeRoutes);
app.use("/api/users", globalLimiter, users);
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
