import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  const data = await Transaction.find().sort({ createdAt: -1 });
  res.json(data);
});

// POST
router.post("/", async (req, res) => {
  const newTx = new Transaction(req.body);
  const saved = await newTx.save();
  res.json(saved);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// UPDATE
router.put("/:id", async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

export default router;