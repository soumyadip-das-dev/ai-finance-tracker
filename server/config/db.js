import mongoose from "mongoose";
import { config } from "./env.js";

/**
 * Connect to MongoDB database
 */
export const connectDB = async () => {
  try {
    if (!config.mongoUri) {
      console.warn("⚠️ MONGO_URI is not set. Database connection skipped.");
      return;
    }
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};