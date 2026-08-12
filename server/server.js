import express from "express";
import cors from "cors";
import { config, validateEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import recurringRoutes from "./routes/recurringRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { startRecurringJob } from "./jobs/recurringJob.js";

// Validate Environment Variables
validateEnv();

const app = express();

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/recurring", recurringRoutes);
app.use("/api/ai", aiRoutes);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Global Error Handler Middleware (Must be after routes)
app.use(errorHandler);

// Connect to Database & Start Server
connectDB().then(() => {
  // Start background jobs
  startRecurringJob();
  console.log("⏰ Recurring transactions job scheduled");

  app.listen(config.port, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${config.port}`);
  });
});