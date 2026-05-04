import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    type: String,
    category: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", schema);