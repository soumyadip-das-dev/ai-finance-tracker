import RecurringTransaction from "../models/RecurringTransaction.js";
import { addDays, addWeeks, addMonths } from "date-fns";

export const getRecurring = async (req, res) => {
  const items = await RecurringTransaction.find({ user: req.user.id });
  res.json(items);
};

export const addRecurring = async (req, res) => {
  try {
    const { title, amount, type, category, frequency } = req.body;
    const nextRunMap = { daily: addDays, weekly: addWeeks, monthly: addMonths };
    const nextRun = nextRunMap[frequency](new Date(), 1);
    const rec = await RecurringTransaction.create({
      user: req.user.id, title, amount: Number(amount), type, category, frequency, nextRun
    });
    res.status(201).json(rec);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const toggleRecurring = async (req, res) => {
  const rec = await RecurringTransaction.findOne({ _id: req.params.id, user: req.user.id });
  if (!rec) return res.status(404).json({ message: "Not found" });
  rec.active = !rec.active;
  await rec.save();
  res.json(rec);
};

export const deleteRecurring = async (req, res) => {
  await RecurringTransaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: "Deleted" });
};