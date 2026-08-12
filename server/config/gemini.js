import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "./env.js";

let genAIInstance = null;

/**
 * Get or initialize Google Generative AI client
 */
export const getGeminiClient = () => {
  if (!config.geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return genAIInstance;
};
