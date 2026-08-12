import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getRecurringService,
  addRecurringService,
  toggleRecurringService,
  deleteRecurringService,
} from "../services/recurringService.js";

/**
 * @desc    Get user recurring transaction rules
 * @route   GET /api/recurring
 */
export const getRecurring = asyncHandler(async (req, res) => {
  const items = await getRecurringService(req.user.id);
  res.status(200).json(items);
});

/**
 * @desc    Add recurring transaction rule
 * @route   POST /api/recurring
 */
export const addRecurring = asyncHandler(async (req, res) => {
  const rec = await addRecurringService(req.user.id, req.body);
  res.status(201).json(rec);
});

/**
 * @desc    Toggle recurring active status
 * @route   PATCH /api/recurring/:id/toggle
 */
export const toggleRecurring = asyncHandler(async (req, res) => {
  const rec = await toggleRecurringService(req.user.id, req.params.id);
  res.status(200).json(rec);
});

/**
 * @desc    Delete recurring rule
 * @route   DELETE /api/recurring/:id
 */
export const deleteRecurring = asyncHandler(async (req, res) => {
  const result = await deleteRecurringService(req.user.id, req.params.id);
  res.status(200).json(result);
});