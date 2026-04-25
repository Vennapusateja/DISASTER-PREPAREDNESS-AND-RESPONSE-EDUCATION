import "dotenv/config"; // Load environment variables at the very first moment
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";


// Routes
import authRoutes from "./routes/authRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import createAlertRoutes from "./routes/alertRoutes.js";
import externalRoutes from "./routes/externalRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { WebSocketServer } from "ws";

// DEBUG: Confirm Environment Loading
console.log("-----------------------------------------");
console.log("✔ SYSTEM: Initializing Environment...");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envPath)) {
  console.log(`✔ ENV: Found .env at ${envPath}`);
} else {
  console.warn(`✖ ENV: .env file NOT FOUND at ${envPath}`);
}

console.log(`✔ ENV: MONGODB_URI is ${process.env.MONGODB_URI ? "DEFINED" : "MISSING"}`);
if (process.env.MONGODB_URI) {
  // Mask URI for security but show it exists
  const masked = process.env.MONGODB_URI.replace(/:([^:@]{1,})@/, ":****@");
  console.log(`✔ ENV: Using URI: ${masked}`);
}
console.log("-----------------------------------------");

// Validate Required Environment Variables
const REQUIRED_VARS = ["MONGODB_URI", "JWT_SECRET"];
const missingVars = REQUIRED_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error("FATAL ERROR: Missing required environment variables:");
  missingVars.forEach((v) => console.error(` - ${v}`));
  console.error("\nEnsure your .env file is correctly configured in the backend directory.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/external", externalRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ 
    ok: true, 
    service: "backend", 
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString() 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("FIRE EXTINGUISHER ENGINE (Error Handler):", err.stack);
  res.status(500).json({
    ok: false,
    message: err.message || "Something went wrong on the server"
  });
});

async function start() {
  try {
    console.log("✔ DB: Connecting to MongoDB...");
    await connectDB();
    console.log("✔ DB: Connected successfully");

    const PORT = process.env.PORT || 5000;
    const server = http.createServer(app);

    const wss = new WebSocketServer({ server, path: "/ws" });

    function broadcast(event) {
      const payload = JSON.stringify(event);
      for (const client of wss.clients) {
        if (client.readyState === 1) client.send(payload);
      }
    }

    wss.on("connection", (socket) => {
      console.log("✔ WS: Client connected");
      socket.send(JSON.stringify({ type: "welcome", time: new Date().toISOString() }));

      socket.on("message", (raw) => {
        const text = raw?.toString?.() || "";
        if (text === "ping") socket.send(JSON.stringify({ type: "pong", time: new Date().toISOString() }));
      });
      socket.on("close", () => console.log("✖ WS: Client disconnected"));
    });

    app.use("/api/alerts", createAlertRoutes({ broadcast }));

    server.listen(PORT, () => {
      console.log(`✔ SERVER: Running on http://localhost:${PORT}`);
      console.log(`✔ WS: Live on ws://localhost:${PORT}/ws`);
    });
  } catch (err) {
    console.error("✖ FATAL: Failed to start server:", err.message);
    process.exit(1);
  }
}

start();