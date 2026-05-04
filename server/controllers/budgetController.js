import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import { format, startOfMonth } from "date-fns";

export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;
    const month = format(new Date(), "yyyy-MM");
    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category, month },
      { limit: Number(limit) },
      { upsert: true, new: true }
    );
    res.json(budget);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getBudgets = async (req, res) => {
  try {
    const month = req.query.month || format(new Date(), "yyyy-MM");
    const budgets = await Budget.find({ user: req.user.id, month });

    // Enrich with spent amount per category
    const enriched = await Promise.all(budgets.map(async (b) => {
      const [result] = await Transaction.aggregate([
        { $match: { user: b.user, category: b.category, type: "expense",
          date: { $gte: startOfMonth(new Date()) } } },
        { $group: { _id: null, spent: { $sum: "$amount" } } }
      ]);
      return { ...b.toObject(), spent: result?.spent || 0 };
    }));
    res.json(enriched);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const deleteBudget = async (req, res) => {
  try {
    await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Budget deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};