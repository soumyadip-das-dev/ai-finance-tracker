import { useState, useEffect } from "react";
import axios from "../api/axios";
import { format } from "date-fns";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Other"];
const FREQ_LABELS = { daily: "Daily", weekly: "Weekly", monthly: "Monthly" };

export default function RecurringManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Bills",
    frequency: "monthly",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/recurring");
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch recurring rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || isNaN(Number(form.amount))) return;
    try {
      await axios.post("/recurring", form);
      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "Bills",
        frequency: "monthly",
      });
      fetchItems();
    } catch (err) {
      console.error("Failed to schedule recurring rule:", err);
    }
  };

  const toggleActive = async (id) => {
    try {
      await axios.patch(`/recurring/${id}/toggle`);
      fetchItems();
    } catch (err) {
      console.error("Failed to toggle recurring rule:", err);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`/recurring/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Failed to remove recurring rule:", err);
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
          <h2 className="text-white font-bold text-lg tracking-tight">🔁 Recurring Transactions</h2>
          <p className="text-gray-400 text-xs mt-0.5">Autonomous accounting pipeline triggered via cron</p>
        </div>
      </div>

      <form onSubmit={add} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        <input
          placeholder="Title (e.g. Netflix, Rent, Salary)"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 col-span-1 sm:col-span-2 outline-none focus:border-[#00ff88]"
          required
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#00ff88]"
          required
        />
        <select
          value={form.frequency}
          onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#00ff88]"
        >
          {["daily", "weekly", "monthly"].map((f) => (
            <option key={f} value={f} className="bg-[#0d1422]">
              {FREQ_LABELS[f]}
            </option>
          ))}
        </select>
        <select
          value={form.category}
          onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#00ff88]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-[#0d1422]">
              {c}
            </option>
          ))}
        </select>
        <select
          value={form.type}
          onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
          className="bg-[#0d1422] border border-[#1a2332] text-white text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-[#00ff88]"
        >
          <option value="expense" className="bg-[#0d1422]">Expense</option>
          <option value="income" className="bg-[#0d1422]">Income</option>
        </select>

        <button
          type="submit"
          className="col-span-1 sm:col-span-2 bg-[#00ff88] text-[#0a0f1a] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00e87a] transition-all shadow-lg shadow-[#00ff8822]"
        >
          Schedule Recurring Rule
        </button>
      </form>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-[#0d1422] border border-[#1a2332] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-[#243044]"
          >
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{item.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {FREQ_LABELS[item.frequency]} · {item.category} · Next:{" "}
                <span className="text-gray-300">
                  {item.nextRun ? format(new Date(item.nextRun), "dd MMM yyyy") : "Pending"}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span
                className={`text-sm font-mono font-semibold ${
                  item.type === "income" ? "text-[#00ff88]" : "text-[#ff4d6d]"
                }`}
              >
                {item.type === "income" ? "+" : "-"}₹{Number(item.amount).toLocaleString("en-IN")}
              </span>

              <button
                onClick={() => toggleActive(item._id)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  item.active
                    ? "bg-[#00ff8820] text-[#00ff88] border border-[#00ff8840]"
                    : "bg-gray-800 text-gray-400 border border-gray-700"
                }`}
              >
                {item.active ? "Active" : "Paused"}
              </button>

              <button
                onClick={() => remove(item._id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-[#ff4d6d] hover:bg-[#ff4d6d18] transition-colors text-xs"
                title="Delete rule"
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No recurring rules established. Add one above to automate your ongoing commitments.
          </div>
        )}
      </div>
    </div>
  );
}