import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { ENV } from "./lib/env.js";

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body

// CORS configuration to allow multiple origins
app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel deployments, localhost, and configured CLIENT_URL
    if (
      origin.includes('.vercel.app') || 
      origin === ENV.CLIENT_URL || 
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:3000'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Blitzed API is running",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path 
  });
});

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});