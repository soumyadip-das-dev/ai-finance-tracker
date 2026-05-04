import { useState } from "react";
import axios from "axios";

const categoryConfig = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "📄",
  Health: "💊",
  Other: "📦"
};

const TransactionList = ({ transactions, refresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // DELETE
  const deleteTransaction = async (id) => {
    await axios.delete(`http://localhost:5000/api/transactions/${id}`);
    refresh();
  };

  // START EDIT
  const startEdit = (t) => {
    setEditingId(t._id);
    setEditData(t);
  };

  // SAVE EDIT
  const saveEdit = async () => {
    await axios.put(
      `http://localhost:5000/api/transactions/${editingId}`,
      editData
    );
    setEditingId(null);
    refresh();
  };

  return (
    <div className="transactions">
      <h3>Transactions</h3>

      {transactions.map((t) => (
        <div key={t._id} className="tx-item">

          {editingId === t._id ? (
            <>
              {/* EDIT MODE */}
              <input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />

              <input
                type="number"
                value={editData.amount}
                onChange={(e) =>
                  setEditData({ ...editData, amount: e.target.value })
                }
              />

              <button onClick={saveEdit}>💾</button>
            </>
          ) : (
            <>
              {/* NORMAL VIEW */}
              <div style={{ display: "flex", gap: "10px" }}>
                <span>{categoryConfig[t.category] || "📦"}</span>
                <span>{t.title}</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span
                  style={{
                    color: t.type === "expense" ? "#ef4444" : "#22c55e"
                  }}
                >
                  ₹{t.amount}
                </span>

                <button onClick={() => startEdit(t)}>✏️</button>
                <button onClick={() => deleteTransaction(t._id)}>🗑️</button>
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  );
};

export default TransactionList;