import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { startOfMonth, format } from "date-fns";

export const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, note } = req.body;
    const transaction = await Transaction.create({
      user: req.user.id,
      title, amount: Number(amount), type, category, note
    });

    let alert = null;
    if (type === "expense") {
      const month = format(new Date(), "yyyy-MM");
      const budget = await Budget.findOne({ user: req.user.id, category, month });
      if (budget) {
        const result = await Transaction.aggregate([
          { $match: { user: transaction.user, category, type: "expense",
            date: { $gte: startOfMonth(new Date()) } } },
          { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const spent = result[0]?.total || 0;
        const pct = (spent / budget.limit) * 100;
        if (pct >= 100) alert = { type: "danger", message: `🚨 ${category} budget exceeded! ₹${spent} / ₹${budget.limit}` };
        else if (pct >= 80) alert = { type: "warning", message: `⚠️ ${category} budget at ${Math.round(pct)}% — ₹${spent} / ₹${budget.limit}` };
      }
    }

    res.status(201).json({ transaction, alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { limit = 100, type, category, startDate, endDate } = req.query;
    const filter = { user: req.user.id };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
    const transactions = await Transaction.find(filter).sort({ date: -1 }).limit(Number(limit));
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};