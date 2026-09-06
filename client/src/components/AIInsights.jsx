import { useState } from "react";
import { fetchAIAnalysisApi } from "../api/aiApi";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import CircularProgress from "@mui/material/CircularProgress";

const AIInsights = ({ transactions = [] }) => {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAIAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAIAnalysisApi();
      setAiData(data);
    } catch (err) {
      console.error("Failed to load Gemini analysis:", err);
      setError("Unable to generate AI analysis at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = transactions.reduce((s, t) => s + t.amount, 0);

  const map = {};
  transactions.forEach((t) => {
    const cat = t.category || "Other";
    map[cat] = (map[cat] || 0) + t.amount;
  });

  let topCategory = "—";
  let max = 0;
  for (let k in map) {
    if (map[k] > max) {
      max = map[k];
      topCategory = k;
    }
  }

  const isHighSpend = total > 0 && max > total * 0.4;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #111827cc 0%, #0d1422cc 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid #1a2332",
        borderRadius: "16px",
        padding: "clamp(16px, 3vw, 24px)",
        color: "#e2e8f0",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "rgba(0, 255, 136, 0.12)",
              border: "1px solid rgba(0, 255, 136, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00ff88",
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f8fafc",
              letterSpacing: "-0.01em",
            }}
          >
            Gemini AI Advisor
          </h3>
        </div>

        <button
          onClick={loadAIAnalysis}
          disabled={loading || transactions.length === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(0, 255, 136, 0.1)",
            border: "1px solid rgba(0, 255, 136, 0.25)",
            color: "#00ff88",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: transactions.length === 0 ? "not-allowed" : "pointer",
            opacity: transactions.length === 0 ? 0.5 : 1,
            transition: "all 0.15s ease",
            fontFamily: "inherit",
          }}
        >
          {loading ? (
            <CircularProgress size={14} sx={{ color: "#00ff88" }} />
          ) : (
            <RefreshRoundedIcon sx={{ fontSize: 16 }} />
          )}
          <span>{aiData ? "Re-analyze" : "Analyze Spend"}</span>
        </button>
      </div>

      {/* Local quick stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            padding: "10px 12px",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Tracked Total</span>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#f1f5f9",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            padding: "10px 12px",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Highest Category</span>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: "#38bdf8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {topCategory}
          </p>
        </div>
      </div>

      {/* Local Alert if high spending */}
      {isHighSpend && !aiData && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: 12,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 18, color: "#f59e0b", flexShrink: 0, mt: "2px" }} />
          <span style={{ fontSize: "0.8rem", color: "#fcd34d", lineHeight: 1.4 }}>
            High allocation detected: <b>{topCategory}</b> accounts for over 40% of total expenses.
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          style={{
            padding: "10px 12px",
            background: "rgba(255, 77, 109, 0.08)",
            border: "1px solid rgba(255, 77, 109, 0.2)",
            borderRadius: "10px",
            color: "#ff4d6d",
            fontSize: "0.8rem",
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Gemini AI Results */}
      {aiData && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
          {/* Health Score Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(0, 255, 136, 0.06)",
              border: "1px solid rgba(0, 255, 136, 0.2)",
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            <div>
              <span style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Budget Health Score
              </span>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#cbd5e1" }}>
                {aiData.score >= 80 ? "Excellent standing" : aiData.score >= 60 ? "Moderate health" : "Needs attention"}
              </p>
            </div>
            <div
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: aiData.score >= 80 ? "#00ff88" : aiData.score >= 60 ? "#f59e0b" : "#ff4d6d",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {aiData.score}
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>/100</span>
            </div>
          </div>

          {/* AI Summary */}
          {aiData.summary && (
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.5 }}>
              {aiData.summary}
            </p>
          )}

          {/* Critical Warning */}
          {aiData.warning && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                background: "rgba(255, 77, 109, 0.08)",
                border: "1px solid rgba(255, 77, 109, 0.25)",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
            >
              <WarningAmberRoundedIcon sx={{ fontSize: 16, color: "#ff4d6d", flexShrink: 0, mt: "2px" }} />
              <span style={{ fontSize: "0.78rem", color: "#fca5a5" }}>{aiData.warning}</span>
            </div>
          )}

          {/* Tips list */}
          {aiData.tips && aiData.tips.length > 0 && (
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#38bdf8", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                <LightbulbOutlinedIcon sx={{ fontSize: 14 }} /> Recommendations
              </span>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                {aiData.tips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!aiData && !loading && (
        <p style={{ margin: "10px 0 0", fontSize: "0.76rem", color: "#64748b", textAlign: "center" }}>
          Tap <b>Analyze Spend</b> for real-time Gemini AI health scores and budgeting recommendations.
        </p>
      )}
    </div>
  );
};

export default AIInsights;