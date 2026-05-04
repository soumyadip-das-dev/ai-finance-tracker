/**
 * Dashboard.jsx — Industry-grade Expense Tracker
 *
 * Stack: React + MUI + Axios
 * Fonts loaded via index.html or App.jsx:
 *   <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
 *
 * Drop-in replacement — keep your existing:
 *   AddTransaction, ExpenseChart, AIInsights components
 */

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
} from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Skeleton,
  Chip,
  Tooltip,
  Snackbar,
  Alert,
  Fade,
  Collapse,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import AddTransaction from "../components/AddTransaction";
import ExpenseChart from "../components/ExpenseChart";
import AIInsights from "../components/AIInsights";

// ─── Design Tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: "#080c14",
  surface: "#0d1422",
  card: "#111827",
  border: "#1a2332",
  borderHover: "#243044",
  accent: "#00ff88",
  accentDim: "#00ff8822",
  accentMid: "#00ff8844",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#334155",
  danger: "#ff4d6d",
  dangerDim: "#ff4d6d18",
  warn: "#f59e0b",
  info: "#38bdf8",
  fontDisplay: "'Sora', sans-serif",
  fontMono: "'DM Mono', monospace",
};

const CATEGORY_META = {
  Food:          { color: "#00ff88", icon: "🥗" },
  Travel:        { color: "#38bdf8", icon: "✈️" },
  Shopping:      { color: "#f59e0b", icon: "🛍️" },
  Bills:         { color: "#ff4d6d", icon: "📄" },
  Entertainment: { color: "#a78bfa", icon: "🎬" },
  Health:        { color: "#34d399", icon: "💊" },
  Other:         { color: "#94a3b8", icon: "📦" },
};

const CATEGORIES = Object.keys(CATEGORY_META);
const API = `${import.meta.env.VITE_API_URL}/api/transactions`;

// ─── Global CSS (injected once) ───────────────────────────────────────────────

const injectGlobalStyles = () => {
  if (document.getElementById("dash-global-styles")) return;
  const style = document.createElement("style");
  style.id = "dash-global-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');

    * { box-sizing: border-box; }

    body {
      background: ${T.bg};
      font-family: ${T.fontDisplay};
      color: ${T.text};
    }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: ${T.borderHover}; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.8); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes bar-grow {
      from { width: 0; }
    }
    @keyframes counter-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes border-glow {
      0%, 100% { box-shadow: 0 0 0 0 ${T.accentDim}; }
      50%       { box-shadow: 0 0 0 6px ${T.accentDim}; }
    }

    .fade-up {
      animation: fadeUp 0.4s cubic-bezier(.2,0,.1,1) both;
    }
    .fade-up-1 { animation-delay: 0.05s; }
    .fade-up-2 { animation-delay: 0.10s; }
    .fade-up-3 { animation-delay: 0.15s; }
    .fade-up-4 { animation-delay: 0.20s; }
    .fade-up-5 { animation-delay: 0.25s; }

    .tx-row {
      transition: background 0.15s, border-color 0.15s;
    }
    .tx-row:hover {
      background: rgba(255,255,255,0.025) !important;
    }
    .tx-row:hover .tx-actions {
      opacity: 1 !important;
      pointer-events: auto !important;
    }
    .tx-actions {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.15s;
    }

    .stat-value {
      animation: counter-in 0.5s cubic-bezier(.2,0,.1,1) both;
      font-family: ${T.fontMono};
    }

    .progress-bar {
      animation: bar-grow 0.8s cubic-bezier(.4,0,.2,1) both;
    }

    .card-glass {
      background: linear-gradient(135deg, #111827cc 0%, #0d1422cc 100%);
      backdrop-filter: blur(12px);
      border: 1px solid ${T.border};
      border-radius: 16px;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    }
    .card-glass:hover {
      border-color: ${T.borderHover};
    }

    .accent-card {
      background: linear-gradient(135deg, #00ff8812 0%, #0d1422 60%);
      border: 1px solid #00ff8830;
    }
    .accent-card:hover {
      border-color: #00ff8860;
      box-shadow: 0 0 32px #00ff8812;
    }

    .delete-btn:hover {
      color: ${T.danger} !important;
      background: ${T.dangerDim} !important;
    }
    .edit-btn:hover {
      color: ${T.accent} !important;
      background: ${T.accentDim} !important;
    }

    .noise-overlay::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      border-radius: inherit;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
};

// ─── Custom Hooks ─────────────────────────────────────────────────────────────

const useToast = () => {
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const show = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);
  const hide = useCallback(() => setToast((p) => ({ ...p, open: false })), []);
  return { toast, show, hide };
};

const useTransactions = (showToast) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const { data } = await axios.get(API, { signal: abortRef.current.signal });
      const sorted = [...data].sort((a, b) =>
        a.date && b.date ? new Date(b.date) - new Date(a.date) : 0
      );
      setTransactions(sorted);
    } catch (err) {
      if (!axios.isCancel(err)) showToast("Failed to load transactions", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const remove = useCallback(async (id) => {
    // Optimistic
    setTransactions((prev) => prev.filter((t) => t._id !== id));
    try {
      await axios.delete(`${API}/${id}`);
      showToast("Transaction removed");
    } catch {
      showToast("Failed to delete — refreshing", "error");
      fetchData();
    }
  }, [showToast, fetchData]);

  const update = useCallback(async (id, form) => {
    try {
      const { data } = await axios.put(`${API}/${id}`, {
        ...transactions.find((t) => t._id === id),
        ...form,
        amount: Number(form.amount),
      });
      setTransactions((prev) => prev.map((t) => (t._id === id ? data : t)));
      showToast("Changes saved");
      return true;
    } catch {
      showToast("Failed to update", "error");
      return false;
    }
  }, [transactions, showToast]);

  return { transactions, loading, fetchData, remove, update };
};

// ─── Animated Number ──────────────────────────────────────────────────────────

const AnimatedNumber = ({ value, prefix = "", suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const target = typeof value === "number" ? value : parseFloat(value) || 0;
    const start = prevRef.current;
    const diff = target - start;
    const duration = 600;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * ease));
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = target;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="stat-value">
      {prefix}{display.toLocaleString("en-IN")}{suffix}
    </span>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, prefix, suffix, icon, accent, delay = 0, sublabel }) => (
  <div
    className={`card-glass noise-overlay fade-up ${accent ? "accent-card" : ""}`}
    style={{
      position: "relative",
      overflow: "hidden",
      padding: "20px 24px",
      animationDelay: `${delay}s`,
    }}
  >
    {/* Subtle grid pattern */}
    <div style={{
      position: "absolute", inset: 0, opacity: 0.03,
      backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    }} />

    <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{
            margin: 0, fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: T.textMuted, fontFamily: T.fontDisplay,
          }}>
            {label}
          </p>
          <div style={{
            marginTop: 8, fontSize: "1.8rem", fontWeight: 700,
            color: accent ? T.accent : T.text, lineHeight: 1,
          }}>
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </div>
          {sublabel && (
            <p style={{ margin: "6px 0 0", fontSize: "0.72rem", color: T.textMuted }}>
              {sublabel}
            </p>
          )}
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: accent ? T.accentDim : "rgba(255,255,255,0.04)",
          border: `1px solid ${accent ? T.accentMid : T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accent ? T.accent : T.textMuted, fontSize: "1.1rem",
        }}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

// ─── Category Bar ─────────────────────────────────────────────────────────────

const CategoryBar = ({ cat, val, total, rank }) => {
  const meta = CATEGORY_META[cat] || CATEGORY_META.Other;
  const pct = total ? Math.round((val / total) * 100) : 0;

  return (
    <div
      className="fade-up"
      style={{ marginBottom: 18, animationDelay: `${0.1 + rank * 0.06}s` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.85rem" }}>{meta.icon}</span>
          <span style={{ fontSize: "0.82rem", fontWeight: 500, color: T.text }}>{cat}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: T.fontMono, fontSize: "0.8rem", color: T.text }}>
            ₹{val.toLocaleString("en-IN")}
          </span>
          <span style={{
            fontFamily: T.fontMono, fontSize: "0.7rem", color: meta.color,
            background: `${meta.color}18`, borderRadius: 4, padding: "2px 6px",
          }}>
            {pct}%
          </span>
        </div>
      </div>

      <div style={{ height: 4, background: T.border, borderRadius: 99, overflow: "hidden" }}>
        <div
          className="progress-bar"
          style={{
            height: "100%", borderRadius: 99,
            background: `linear-gradient(90deg, ${meta.color}88, ${meta.color})`,
            width: `${pct}%`,
            animationDelay: `${0.2 + rank * 0.08}s`,
            boxShadow: `0 0 8px ${meta.color}66`,
          }}
        />
      </div>
    </div>
  );
};

// ─── Transaction Row ──────────────────────────────────────────────────────────

const TxRow = ({ t, onEdit, onDelete, index }) => {
  const meta = CATEGORY_META[t.category] || CATEGORY_META.Other;
  const date = t.date
    ? new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : null;

  return (
    <div
      className="tx-row fade-up"
      style={{
        display: "flex", alignItems: "center",
        padding: "10px 12px", borderRadius: 10, margin: "2px 0",
        gap: 12, animationDelay: `${0.05 * index}s`,
      }}
    >
      {/* Category icon bubble */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${meta.color}18`,
        border: `1px solid ${meta.color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.95rem",
      }}>
        {meta.icon}
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: "0.85rem", fontWeight: 500,
          color: T.text, whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {t.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: "0.68rem", color: meta.color, fontWeight: 600 }}>
            {t.category}
          </span>
          {date && (
            <>
              <span style={{ width: 2, height: 2, borderRadius: "50%", background: T.textDim }} />
              <span style={{ fontSize: "0.68rem", color: T.textMuted }}>{date}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}
      <span style={{
        fontFamily: T.fontMono, fontSize: "0.9rem", fontWeight: 500,
        color: T.text, flexShrink: 0,
      }}>
        ₹{t.amount.toLocaleString("en-IN")}
      </span>

      {/* Actions — visible on row hover */}
      <div className="tx-actions" style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        <Tooltip title="Edit" placement="top">
          <IconButton
            size="small" className="edit-btn"
            onClick={() => onEdit(t)}
            sx={{ width: 28, height: 28, color: T.textMuted, borderRadius: "8px" }}
          >
            <EditRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" placement="top">
          <IconButton
            size="small" className="delete-btn"
            onClick={() => onDelete(t)}
            sx={{ width: 28, height: 28, color: T.textMuted, borderRadius: "8px" }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────

const EditModal = ({ open, transaction, onClose, onSave }) => {
  const [form, setForm] = useState({ title: "", amount: "", category: "" });
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (transaction) {
      setForm({ title: transaction.title, amount: String(transaction.amount), category: transaction.category });
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [transaction]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const valid = form.title.trim() && Number(form.amount) > 0;

  const handleSave = async () => {
    if (!valid) return;
    setSaving(true);
    const ok = await onSave(transaction._id, form);
    setSaving(false);
    if (ok) onClose();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      fontFamily: T.fontDisplay,
      fontSize: "0.875rem",
      background: T.bg,
      borderRadius: "10px",
      "& fieldset": { borderColor: T.border },
      "&:hover fieldset": { borderColor: T.borderHover },
      "&.Mui-focused fieldset": { borderColor: T.accent, borderWidth: 1 },
    },
    "& .MuiInputLabel-root": { fontFamily: T.fontDisplay, fontSize: "0.85rem", color: T.textMuted },
    "& .MuiInputLabel-root.Mui-focused": { color: T.accent },
    "& .MuiSelect-select": { fontFamily: T.fontDisplay },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: "16px",
          minWidth: 360,
          fontFamily: T.fontDisplay,
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle sx={{
        fontFamily: T.fontDisplay, fontWeight: 600, fontSize: "1rem",
        pb: 0, color: T.text, display: "flex", alignItems: "center", gap: 1,
      }}>
        <EditRoundedIcon sx={{ fontSize: 18, color: T.accent }} />
        Edit Transaction
      </DialogTitle>

      <DialogContent sx={{ pt: "20px !important", display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          inputRef={titleRef}
          label="Title" value={form.title} onChange={set("title")}
          fullWidth size="small" sx={inputSx}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <TextField
          label="Amount (₹)" type="number" value={form.amount} onChange={set("amount")}
          fullWidth size="small" sx={{
            ...inputSx,
            "& input": { fontFamily: T.fontMono },
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <TextField
          select label="Category" value={form.category} onChange={set("category")}
          fullWidth size="small" sx={inputSx}
        >
          {CATEGORIES.map((cat) => {
            const m = CATEGORY_META[cat];
            return (
              <MenuItem key={cat} value={cat} sx={{ fontFamily: T.fontDisplay, fontSize: "0.85rem", gap: 1 }}>
                <span>{m.icon}</span>
                <span>{cat}</span>
              </MenuItem>
            );
          })}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ fontFamily: T.fontDisplay, color: T.textMuted, borderRadius: "8px",
            fontSize: "0.8rem", "&:hover": { background: "rgba(255,255,255,0.04)" } }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!valid || saving}
          variant="contained"
          sx={{
            fontFamily: T.fontDisplay, fontWeight: 600, fontSize: "0.8rem",
            borderRadius: "8px", background: T.accent, color: "#0a0f1a",
            "&:hover": { background: "#00e87a" },
            "&:disabled": { background: T.textDim, color: T.textMuted },
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

const ConfirmDelete = ({ open, transaction, onClose, onConfirm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    TransitionComponent={Fade}
    PaperProps={{
      sx: {
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: "16px", minWidth: 320, backgroundImage: "none",
      },
    }}
  >
    <DialogTitle sx={{ fontFamily: T.fontDisplay, fontWeight: 600, fontSize: "0.95rem", color: T.text, display: "flex", alignItems: "center", gap: 1 }}>
      <WarningAmberRoundedIcon sx={{ fontSize: 18, color: T.warn }} />
      Delete Transaction?
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ fontFamily: T.fontDisplay, fontSize: "0.82rem", color: T.textMuted }}>
        <strong style={{ color: T.text }}>{transaction?.title}</strong> — ₹{transaction?.amount?.toLocaleString("en-IN")} will be permanently removed.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
      <Button onClick={onClose} sx={{ fontFamily: T.fontDisplay, color: T.textMuted, borderRadius: "8px", fontSize: "0.8rem" }}>
        Cancel
      </Button>
      <Button
        onClick={() => { onConfirm(transaction._id); onClose(); }}
        variant="contained"
        sx={{ fontFamily: T.fontDisplay, fontWeight: 600, fontSize: "0.8rem", borderRadius: "8px", background: T.danger, color: "#fff", "&:hover": { background: "#e63355" } }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

// ─── Section Heading ──────────────────────────────────────────────────────────

const SectionHead = ({ children, right }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
    <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: T.text, fontFamily: T.fontDisplay, letterSpacing: "0.01em" }}>
      {children}
    </h3>
    {right}
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard = () => {
  useEffect(() => { injectGlobalStyles(); }, []);

  const { toast, show: showToast, hide: hideToast } = useToast();
  const { transactions, loading, fetchData, remove, update } = useTransactions(showToast);

  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ── Derived stats ──
  const stats = useMemo(() => {
    const total = transactions.reduce((s, t) => s + t.amount, 0);
    const categoryMap = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const topCategory = sorted[0]?.[0] ?? "—";
    const topAmount = sorted[0]?.[1] ?? 0;
    const avgTx = transactions.length ? Math.round(total / transactions.length) : 0;
    return { total, categoryMap, sortedCategories: sorted, topCategory, topAmount, avgTx };
  }, [transactions]);

  // ── Filtered transactions ──
  const visibleTx = useMemo(() =>
    categoryFilter === "All"
      ? transactions
      : transactions.filter((t) => t.category === categoryFilter),
    [transactions, categoryFilter]
  );

  const activeCategories = useMemo(() =>
    ["All", ...Object.keys(stats.categoryMap)],
    [stats.categoryMap]
  );

  // ── Render ──
  return (
    <Box sx={{
      bgcolor: T.bg, minHeight: "100vh",
      p: { xs: 2, md: "28px 32px" },
      fontFamily: T.fontDisplay,
    }}>
      <Box maxWidth="1280px" mx="auto">

        {/* ── Page Header ── */}
        <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: T.accent,
                animation: "pulse-dot 2s ease-in-out infinite",
              }} />
              <span style={{ fontSize: "0.7rem", color: T.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Live
              </span>
            </div>
            <h1 style={{
              margin: 0, fontSize: "1.5rem", fontWeight: 700,
              fontFamily: T.fontDisplay, color: T.text, letterSpacing: "-0.03em",
            }}>
              Expense Tracker
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: T.textMuted }}>
              {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} tracked
            </p>
          </div>

          <AddTransaction refresh={fetchData} />
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16, marginBottom: 24,
        }}>
          {loading ? (
            [1,2,3,4].map(n => (
              <Skeleton key={n} variant="rounded" height={100}
                sx={{ bgcolor: "#0d1422", borderRadius: "16px" }} />
            ))
          ) : (
            <>
              <StatCard
                label="Total Spending" value={stats.total}
                prefix="₹" accent delay={0}
                icon={<TrendingUpRoundedIcon sx={{ fontSize: 18 }} />}
                sublabel={`Across ${transactions.length} transactions`}
              />
              <StatCard
                label="Transactions" value={transactions.length}
                delay={0.05}
                icon={<ReceiptLongRoundedIcon sx={{ fontSize: 18 }} />}
                sublabel="All time"
              />
              <StatCard
                label="Avg Transaction" value={stats.avgTx}
                prefix="₹" delay={0.10}
                icon={<TrendingDownRoundedIcon sx={{ fontSize: 18 }} />}
                sublabel="Per transaction"
              />
              <StatCard
                label="Top Category" value={0}
                delay={0.15}
                icon={<LeaderboardRoundedIcon sx={{ fontSize: 18 }} />}
                sublabel={
                  stats.topCategory !== "—"
                    ? `${stats.topCategory} · ₹${stats.topAmount.toLocaleString("en-IN")}`
                    : "No data yet"
                }
              />
            </>
          )}
        </div>

        {/* ── Main Grid ── */}
        <Grid container spacing={3}>

          {/* LEFT COL */}
          <Grid item xs={12} lg={7}>

            {/* Chart Card */}
            <div className="card-glass noise-overlay fade-up fade-up-2" style={{ padding: "24px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <SectionHead>Spending Distribution</SectionHead>
              <Box display="flex" justifyContent="center">
                <ExpenseChart transactions={transactions} />
              </Box>
            </div>

            {/* Category Breakdown */}
            <div className="card-glass noise-overlay fade-up fade-up-3" style={{ padding: "24px", position: "relative", overflow: "hidden" }}>
              <SectionHead>Category Breakdown</SectionHead>
              {loading
                ? [1,2,3].map(n => <Skeleton key={n} height={36} sx={{ bgcolor: "#0d1422", mb: 1, borderRadius: "8px" }} />)
                : stats.sortedCategories.length === 0
                ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: T.textMuted, fontSize: "0.82rem" }}>
                    No transactions yet
                  </div>
                )
                : stats.sortedCategories.map(([cat, val], i) => (
                  <CategoryBar key={cat} cat={cat} val={val} total={stats.total} rank={i} />
                ))
              }
            </div>
          </Grid>

          {/* RIGHT COL */}
          <Grid item xs={12} lg={5}>

            {/* AI Insights */}
            <div className="fade-up fade-up-3">
              <AIInsights transactions={transactions} />
            </div>

            {/* Transactions List */}
            <div className="card-glass noise-overlay fade-up fade-up-4" style={{ marginTop: 20, padding: "24px", position: "relative", overflow: "hidden" }}>
              <SectionHead
                right={
                  <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterListRoundedIcon sx={{ fontSize: 14, color: T.textMuted }} />
                  </div>
                }
              >
                Recent Transactions
              </SectionHead>

              {/* Category Filter Chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                {activeCategories.map((cat) => {
                  const active = categoryFilter === cat;
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      style={{
                        fontFamily: T.fontDisplay, fontSize: "0.7rem", fontWeight: 500,
                        padding: "4px 10px", borderRadius: 99, cursor: "pointer",
                        border: `1px solid ${active ? (meta?.color ?? T.accent) : T.border}`,
                        background: active ? `${(meta?.color ?? T.accent)}18` : "transparent",
                        color: active ? (meta?.color ?? T.accent) : T.textMuted,
                        transition: "all 0.15s",
                      }}
                    >
                      {cat !== "All" && meta?.icon} {cat}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: T.border, marginBottom: 8 }} />

              {loading ? (
                [1,2,3,4].map(n => (
                  <Skeleton key={n} height={52} sx={{ bgcolor: "#0d1422", mb: 0.5, borderRadius: "10px" }} />
                ))
              ) : visibleTx.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <ReceiptLongRoundedIcon sx={{ fontSize: 36, color: T.textDim, mb: 1 }} />
                  <p style={{ margin: 0, fontSize: "0.8rem", color: T.textMuted }}>
                    {categoryFilter === "All" ? "No transactions yet" : `No ${categoryFilter} transactions`}
                  </p>
                </div>
              ) : (
                visibleTx.map((t, i) => (
                  <TxRow
                    key={t._id} t={t} index={i}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}

              {visibleTx.length > 0 && (
                <div style={{
                  marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}`,
                  display: "flex", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: "0.72rem", color: T.textMuted }}>
                    Showing {visibleTx.length} of {transactions.length}
                  </span>
                  <span style={{ fontFamily: T.fontMono, fontSize: "0.72rem", color: T.textMuted }}>
                    ₹{visibleTx.reduce((s, t) => s + t.amount, 0).toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

          </Grid>
        </Grid>
      </Box>

      {/* ── Modals ── */}
      <EditModal
        open={Boolean(editTarget)}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={update}
      />
      <ConfirmDelete
        open={Boolean(deleteTarget)}
        transaction={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
      />

      {/* ── Toast ── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={hideToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={hideToast}
          sx={{
            fontFamily: T.fontDisplay, fontSize: "0.8rem", borderRadius: "10px",
            background: toast.severity === "success" ? T.accent : T.danger,
            color: toast.severity === "success" ? "#0a0f1a" : "#fff",
            "& .MuiAlert-icon": { color: "inherit" },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;