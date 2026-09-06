import { useState, useEffect } from "react";
import axios from "../api/axios";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other"];

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ category: "Food", limit: "" });

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/budgets");
      setBudgets(data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!form.limit || isNaN(Number(form.limit))) return;
    try {
      await axios.post("/budgets", form);
      setForm({ category: "Food", limit: "" });
      fetchBudgets();
    } catch (err) {
      console.error("Failed to set budget:", err);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      console.error("Failed to delete budget:", err);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111827cc 0%, #0d1422cc 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid #1a2332",
        borderRadius: "20px",
        padding: "clamp(16px, 3vw, 24px)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-white font-bold text-lg tracking-tight">🎯 Category Budgets</h2>
          <p className="text-gray-400 text-xs mt-0.5">Define monthly limits to prevent overspending</p>
        </div>
      </div>

      <form onSubmit={save} className="flex flex-col sm:flex-row gap-2.5 mb-5">
        <select
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 w-full sm:flex-1 outline-none focus:border-[#00ff88]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#0d1422]">
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Limit (₹)"
          value={form.limit}
          onChange={(e) => setForm((p) => ({ ...p, limit: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 w-full sm:w-36 outline-none focus:border-[#00ff88]"
          required
        />

        <button
          type="submit"
          className="bg-[#00ff88] text-[#0a0f1a] font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#00e87a] transition-all w-full sm:w-auto shrink-0 shadow-lg shadow-[#00ff8822]"
        >
          Set Limit
        </button>
      </form>

      <div className="space-y-3">
        {budgets.map((b) => {
          const limit = Number(b.limit) || 1;
          const spent = Number(b.spent) || 0;
          const pct = Math.min((spent / limit) * 100, 100);
          const barColor =
            pct >= 100
              ? "bg-[#ff4d6d]"
              : pct >= 80
              ? "bg-[#f59e0b]"
              : "bg-[#00ff88]";

          return (
            <div
              key={b._id}
              className="bg-[#0d1422] border border-[#1a2332] rounded-xl p-3.5 transition-all hover:border-[#243044]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{b.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 text-xs font-mono">
                    ₹{spent.toLocaleString("en-IN")} / ₹{limit.toLocaleString("en-IN")}
                  </span>
                  <button
                    onClick={() => remove(b._id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#ff4d6d] hover:bg-[#ff4d6d18] transition-colors text-xs"
                    title="Delete budget"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="bg-[#111827] rounded-full h-2 overflow-hidden">
                <div
                  className={`${barColor} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {pct >= 80 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className={`text-xs font-medium ${
                      pct >= 100 ? "text-[#ff4d6d]" : "text-[#f59e0b]"
                    }`}
                  >
                    {pct >= 100
                      ? "⛔ Exceeded monthly allocation!"
                      : `⚠️ Approaching limit (${Math.round(pct)}% utilized)`}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {budgets.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No budget limits configured yet. Set one above to track your spending limits.
          </div>
        )}
      </div>
    </div>
  );
}