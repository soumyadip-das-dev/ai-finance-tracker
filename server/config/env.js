import dotenv from "dotenv";

dotenv.config();

/**
 * Validate required environment variables on server startup
 */
export const validateEnv = () => {
  const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️ WARNING: Missing critical environment variables: ${missing.join(", ")}`
    );
  }
};

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  geminiApiKey: process.env.GEMINI_API_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:5173"],
};
