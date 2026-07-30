import { useState, useEffect } from "react";
import axios from "../api/axios";

const CATEGORIES = ["Food","Travel","Shopping","Bills","Health","Entertainment","Other"];

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: "Food", limit: "" });

  const fetchBudgets = async () => {
    const { data } = await axios.get("/budgets");
    setBudgets(data);
  };

  useEffect(() => { fetchBudgets(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await axios.post("/budgets", form);
    setForm({ category: "Food", limit: "" });
    fetchBudgets();
  };

  const remove = async (id) => {
    await axios.delete(`/budgets/${id}`);
    fetchBudgets();
  };

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-5">
      <h2 className="text-white font-semibold text-base mb-4">🎯 Budget Limits</h2>

      <form onSubmit={save} className="flex gap-2 mb-4">
        <select
          value={form.category}
          onChange={e => setForm(p => ({...p, category: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2 flex-1"
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <input
          type="number"
          placeholder="Limit ₹"
          value={form.limit}
          onChange={e => setForm(p => ({...p, limit: e.target.value}))}
          className="bg-dark-700 border border-dark-600 text-white text-sm rounded-xl px-3 py-2 w-28"
          required
        />
        <button type="submit" className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium">Set</button>
      </form>

      <div className="space-y-3">
        {budgets.map(b => {
          const pct = Math.min((b.spent / b.limit) * 100, 100);
          const barColor = pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-yellow-500" : "bg-income";
          return (
            <div key={b._id} className="bg-dark-700 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-gray-300 text-sm">{b.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs">₹{b.spent?.toLocaleString()} / ₹{b.limit.toLocaleString()}</span>
                  <button onClick={() => remove(b._id)} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
                </div>
              </div>
              <div className="bg-dark-800 rounded-full h-2">
                <div className={`${barColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }} />
              </div>
              {pct >= 80 && (
                <p className={`text-xs mt-1 ${pct >= 100 ? "text-red-400" : "text-yellow-400"}`}>
                  {pct >= 100 ? "⛔ Budget exceeded!" : `⚠️ ${Math.round(pct)}% used`}
                </p>
              )}
            </div>
          );
        })}
        {budgets.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-3">No budgets set yet.</p>
        )}
      </div>
    </div>
  );
}