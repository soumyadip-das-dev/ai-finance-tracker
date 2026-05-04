import express from "express";
import {
  getRecurring,
  addRecurring,
  toggleRecurring,
  deleteRecurring
} from "../controllers/recurringController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// routes
router.get("/", protect, getRecurring);
router.post("/", protect, addRecurring);
router.patch("/:id/toggle", protect, toggleRecurring);
router.delete("/:id", protect, deleteRecurring);

// ✅ THIS LINE IS MISSING (ADD THIS)
export default router;