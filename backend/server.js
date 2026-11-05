
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

// Basic security
app.disable("x-powered-by");
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Request parsing
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Verify the origin of authentication-changing requests
function verifyRequestOrigin(req, res, next) {
  const origin = req.get("Origin");

  if (!origin || !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed.",
    });
  }

  next();
}

app.use(
  [
    "/api/auth/register",
    "/api/auth/login",
    "/api/auth/logout",
  ],
  verifyRequestOrigin
);

// Rate limiting for login and registration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

app.use(
  ["/api/auth/register", "/api/auth/login"],
  authLimiter
);

// API homepage
app.get("/", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to SecureAuth API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      register: "/api/auth/register",
      login: "/api/auth/login",
      profile: "/api/auth/me",
      logout: "/api/auth/logout",
    },
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "SecureAuth API is running successfully",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Unknown endpoints
app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Connect MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
      throw new Error("Missing required environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `SecureAuth backend running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
