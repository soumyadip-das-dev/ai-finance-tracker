import { GoogleGenerativeAI } from "@google/generative-ai";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import { format, startOfMonth, subMonths } from "date-fns";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeSpending = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const month = format(now, "yyyy-MM");

    // Fetch last 3 months of transactions
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: subMonths(startOfMonth(now), 3) }
    }).sort({ date: -1 });

    // Fetch current budgets
    const budgets = await Budget.find({ user: userId, month });

    // Build context
    const txSummary = transactions.map(t =>
      `[${format(new Date(t.date), "dd MMM")}] ${t.type.toUpperCase()} | ${t.category} | ₹${t.amount} | ${t.title}`
    ).join("\n");

    const budgetSummary = budgets.map(b =>
      `${b.category}: limit ₹${b.limit}`
    ).join(", ");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a smart personal finance advisor. Analyze this user's spending data:

TRANSACTIONS (last 3 months):
${txSummary || "No transactions yet"}

BUDGET LIMITS: ${budgetSummary || "No budgets set"}

Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "score": <number 0-100 budget health score>,
  "summary": "<2 sentence overall analysis>",
  "patterns": ["<pattern 1>", "<pattern 2>", "<pattern 3>"],
  "tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>"],
  "warning": "<most critical warning or null>",
  "topCategory": "<highest spending category>",
  "monthlyAvg": <average monthly spending as number>
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const json = JSON.parse(text.replace(/```json|```/g, "").trim());
    res.json(json);
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ message: "AI analysis failed: " + err.message });
  }
};