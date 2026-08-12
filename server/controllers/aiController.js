import { asyncHandler } from "../utils/asyncHandler.js";
import { analyzeSpendingService } from "../services/aiService.js";

/**
 * @desc    Analyze user spending using Gemini AI
 * @route   GET /api/ai/analyze
 */
export const analyzeSpending = asyncHandler(async (req, res) => {
  const analysis = await analyzeSpendingService(req.user.id);
  res.status(200).json(analysis);
});