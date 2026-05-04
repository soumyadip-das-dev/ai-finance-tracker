import express from "express";
import { analyzeSpending } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/analyze", protect, analyzeSpending);

export default router;