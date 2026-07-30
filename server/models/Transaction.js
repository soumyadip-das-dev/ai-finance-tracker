import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: {
  type: String,
  required: true,
},
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },

    // ✅ ADD THIS FIELD
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      default: "expense",
    },
    note: {
      type: String,
      default: "",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);