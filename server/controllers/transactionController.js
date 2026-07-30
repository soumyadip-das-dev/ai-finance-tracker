import Transaction from "../models/Transaction.js";

/**
 * @desc Get all transactions (user-specific)
 */
export const getTransactions = async (req, res) => {
  try {

    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);

  } catch (error) {

    console.error("GET ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc Add transaction
 */
export const addTransaction = async (req, res) => {

  try {

    const {
      title,
      amount,
      category,
      type,
    } = req.body;

    // Validation
    if (
      !title ||
      !amount ||
      !category ||
      !type
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const transaction =
      await Transaction.create({
        title,
        amount,
        category,
        type,

        // 🔥 attach logged in user
        user: req.user._id,
      });

    res.status(201).json(transaction);

  } catch (error) {

    console.error("ADD ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc Update transaction
 */
export const updateTransaction = async (
  req,
  res
) => {

  try {

    const transaction =
      await Transaction.findById(
        req.params.id
      );

    // Transaction not found
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Ownership check
    if (
      transaction.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updated =
      await Transaction.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json(updated);

  } catch (error) {

    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * @desc Delete transaction
 */
export const deleteTransaction = async (
  req,
  res
) => {

  try {

    const transaction =
      await Transaction.findById(
        req.params.id
      );

    // Not found
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    // Ownership validation
    if (
      transaction.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted",
    });

  } catch (error) {

    console.error("DELETE ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};