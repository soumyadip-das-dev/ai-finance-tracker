import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { format, startOfMonth } from "date-fns";
import { AppError } from "../utils/AppError.js";

export const setBudgetService = async (userId, { category, limit }) => {
  if (!category || limit === undefined || limit === null) {
    throw new AppError("Category and limit are required", 400);
  }

  const month = format(new Date(), "yyyy-MM");
  return await Budget.findOneAndUpdate(
    { user: userId, category, month },
    { limit: Number(limit) },
    { upsert: true, new: true }
  );
};

export const getBudgetsService = async (userId, monthParam) => {
  const month = monthParam || format(new Date(), "yyyy-MM");
  const budgets = await Budget.find({ user: userId, month });

  const enriched = await Promise.all(
    budgets.map(async (b) => {
      const [result] = await Transaction.aggregate([
        {
          $match: {
            user: b.user,
            category: b.category,
            type: "expense",
            date: { $gte: startOfMonth(new Date()) },
          },
        },
        { $group: { _id: null, spent: { $sum: "$amount" } } },
      ]);
      return { ...b.toObject(), spent: result?.spent || 0 };
    })
  );

  return enriched;
};

export const deleteBudgetService = async (userId, budgetId) => {
  const budget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });
  if (!budget) {
    throw new AppError("Budget not found", 404);
  }
  return { message: "Budget deleted successfully" };
};
