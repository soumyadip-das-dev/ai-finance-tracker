import { asyncHandler } from "../utils/asyncHandler.js";
import {
  setBudgetService,
  getBudgetsService,
  deleteBudgetService,
} from "../services/budgetService.js";

/**
 * @desc    Set or update budget limit for category
 * @route   POST /api/budgets
 */
export const setBudget = asyncHandler(async (req, res) => {
  const budget = await setBudgetService(req.user.id, req.body);
  res.status(200).json(budget);
});

/**
 * @desc    Get user budgets enriched with spending
 * @route   GET /api/budgets
 */
export const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await getBudgetsService(req.user.id, req.query.month);
  res.status(200).json(budgets);
});

/**
 * @desc    Delete budget
 * @route   DELETE /api/budgets/:id
 */
export const deleteBudget = asyncHandler(async (req, res) => {
  const result = await deleteBudgetService(req.user.id, req.params.id);
  res.status(200).json(result);
});