import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const CATEGORIES = ["Food","Travel","Shopping","Bills","Health","Entertainment","Other"];
const FREQ_LABELS = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

export default function RecurringManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "", type: "expense", category: "Bills", frequency: "monthly" });

  const fetch = async () => {
    const { data } = await axios.get("/api/recurring");
    setItems(data);
  };

  useEffect(() => { fetch(); }, []);

  const add = async (e) => {
    e.preventDefault();
    await axios.post("/api/recurring", form);
    setForm({ title: "", amount: "", type: "expense", category: "Bills", frequency: "monthly" });
    fetch();
  };

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <h2 className="text-white font-semibold text-base mb-4">🔁 Recurring Transactions</h2>

      <form onSubmit={add} className="grid grid-cols-2 gap-2 mb-4">
        <input
          placeholder="Title (e.g. Netflix)"
          value={form.title}
          onChange={e => setForm(p => ({...p, title: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2 col-span-2"
          required
        />
        <input
          type="number"
          placeholder="Amount ₹"
          value={form.amount}
          onChange={e => setForm(p => ({...p, amount: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2"
          required
        />
        <select value={form.frequency}
          onChange={e => setForm(p => ({...p, frequency: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2">
          {["daily","weekly","monthly"].map(f => <option key={f} value={f}>{FREQ_LABELS[f]}</option>)}
        </select>
        <select value={form.category}
          onChange={e => setForm(p => ({...p, category: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={form.type}
          onChange={e => setForm(p => ({...p, type: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" className="col-span-2 bg-accent text-white py-2 rounded-xl text-sm font-medium">
          Add Recurring
        </button>
      </form>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item._id} className="bg-dark-700 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium">{item.title}</p>
              <p className="text-gray-500 text-xs">
                {FREQ_LABELS[item.frequency]} · {item.category} · Next: {format(new Date(item.nextRun), "dd MMM")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${item.type === "income" ? "text-income" : "text-expense"}`}>
                ₹{item.amount.toLocaleString()}
              </span>
              <button
                onClick={async () => { await axios.patch(`/api/recurring/${item._id}/toggle`); fetch(); }}
                className={`text-xs px-2 py-1 rounded-lg ${item.active ? "bg-income/20 text-income" : "bg-gray-700 text-gray-400"}`}
              >
                {item.active ? "Active" : "Paused"}
              </button>
              <button
                onClick={async () => { await axios.delete(`/api/recurring/${item._id}`); fetch(); }}
                className="text-gray-600 hover:text-red-400 text-xs"
              >✕</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-3">No recurring transactions yet.</p>
        )}
      </div>
    </div>
  );
}