import RecurringTransaction from "../models/RecurringTransaction.js";
import { addDays, addWeeks, addMonths } from "date-fns";
import { AppError } from "../utils/AppError.js";

export const getRecurringService = async (userId) => {
  return await RecurringTransaction.find({ user: userId });
};

export const addRecurringService = async (userId, { title, amount, type, category, frequency }) => {
  if (!title || !amount || !type || !category || !frequency) {
    throw new AppError("All fields are required", 400);
  }

  const nextRunMap = { daily: addDays, weekly: addWeeks, monthly: addMonths };
  if (!nextRunMap[frequency]) {
    throw new AppError("Invalid frequency specified", 400);
  }

  const nextRun = nextRunMap[frequency](new Date(), 1);
  return await RecurringTransaction.create({
    user: userId,
    title,
    amount: Number(amount),
    type,
    category,
    frequency,
    nextRun,
  });
};

export const toggleRecurringService = async (userId, id) => {
  const rec = await RecurringTransaction.findOne({ _id: id, user: userId });
  if (!rec) {
    throw new AppError("Recurring transaction not found", 404);
  }

  rec.active = !rec.active;
  await rec.save();
  return rec;
};

export const deleteRecurringService = async (userId, id) => {
  const rec = await RecurringTransaction.findOneAndDelete({ _id: id, user: userId });
  if (!rec) {
    throw new AppError("Recurring transaction not found", 404);
  }
  return { message: "Recurring transaction deleted successfully" };
};
