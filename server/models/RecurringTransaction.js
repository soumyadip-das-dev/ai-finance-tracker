import mongoose from "mongoose";

const recurringSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true },
  frequency: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  nextRun: { type: Date, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("RecurringTransaction", recurringSchema);