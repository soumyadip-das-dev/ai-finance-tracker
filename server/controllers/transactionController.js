import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getTransactionsService,
  addTransactionService,
  updateTransactionService,
  deleteTransactionService,
} from "../services/transactionService.js";

/**
 * @desc    Get all user transactions
 * @route   GET /api/transactions
 */
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await getTransactionsService(req.user._id);
  res.status(200).json(transactions);
});

/**
 * @desc    Add transaction
 * @route   POST /api/transactions
 */
export const addTransaction = asyncHandler(async (req, res) => {
  const transaction = await addTransactionService(req.user._id, req.body);
  res.status(201).json(transaction);
});

/**
 * @desc    Update transaction
 * @route   PUT /api/transactions/:id
 */
export const updateTransaction = asyncHandler(async (req, res) => {
  const updated = await updateTransactionService(req.user._id, req.params.id, req.body);
  res.status(200).json(updated);
});

/**
 * @desc    Delete transaction
 * @route   DELETE /api/transactions/:id
 */
export const deleteTransaction = asyncHandler(async (req, res) => {
  const result = await deleteTransactionService(req.user._id, req.params.id);
  res.status(200).json(result);
});