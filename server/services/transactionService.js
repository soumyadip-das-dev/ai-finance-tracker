import Transaction from "../models/Transaction.js";
import { AppError } from "../utils/AppError.js";

export const getTransactionsService = async (userId) => {
  return await Transaction.find({ user: userId }).sort({ createdAt: -1 });
};

export const addTransactionService = async (userId, { title, amount, category, type }) => {
  if (!title || !amount || !category || !type) {
    throw new AppError("All fields are required", 400);
  }

  return await Transaction.create({
    title,
    amount,
    category,
    type,
    user: userId,
  });
};

export const updateTransactionService = async (userId, transactionId, { title, amount, category, type }) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.user.toString() !== userId.toString()) {
    throw new AppError("Not authorized to update this transaction", 401);
  }

  return await Transaction.findByIdAndUpdate(
    transactionId,
    { title, amount, category, type },
    { new: true, runValidators: true }
  );
};

export const deleteTransactionService = async (userId, transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.user.toString() !== userId.toString()) {
    throw new AppError("Not authorized to delete this transaction", 401);
  }

  await transaction.deleteOne();
  return { message: "Transaction deleted successfully" };
};
