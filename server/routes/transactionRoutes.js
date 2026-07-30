import express from "express";

import {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transactionController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/transactions
 * @desc    Get user transactions
 */
router.get("/", protect, getTransactions);

/**
 * @route   POST /api/transactions
 * @desc    Create transaction
 */
router.post("/", protect, addTransaction);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 */
router.put("/:id", protect, updateTransaction);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 */
router.delete("/:id", protect, deleteTransaction);

export default router;