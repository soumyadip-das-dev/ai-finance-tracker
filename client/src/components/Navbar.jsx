import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: <DashboardRoundedIcon sx={{ fontSize: 18 }} /> },
  { to: "/budgets", label: "Budgets", icon: <TrackChangesRoundedIcon sx={{ fontSize: 18 }} /> },
  { to: "/recurring", label: "Recurring", icon: <RepeatRoundedIcon sx={{ fontSize: 18 }} /> },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(10, 14, 26, 0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 16px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* ── Left: Brand ── */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#f8fafc",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "-0.02em",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #00ff88, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              boxShadow: "0 0 12px rgba(0,255,136,0.3)",
            }}
          >
            💸
          </div>
          <span>
            Finance<span style={{ color: "#00ff88" }}>AI</span>
          </span>
        </Link>

        {/* ── Desktop Center: Nav Links (hidden on mobile via CSS) ── */}
        {user && (
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 6 }}
          >
            {NAV_LINKS.map(({ to, label }) => {
              const isActive =
                to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    color: isActive ? "#00ff88" : "#94a3b8",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: "none",
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: isActive ? "rgba(0, 255, 136, 0.08)" : "transparent",
                    border: `1px solid ${isActive ? "rgba(0, 255, 136, 0.2)" : "transparent"}`,
                    transition: "all 0.15s ease",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#f1f5f9";
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#94a3b8";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}

        {/* ── Desktop Right: User info + Logout ── */}
        {user && (
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: 14, flexShrink: 0 }}
          >
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {user.name}
              </div>
              <div style={{ color: "#64748b", fontSize: 11 }}>
                {user.email}
              </div>
            </div>

            <div
              title={user.name}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00ff8822, #38bdf844)",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                color: "#00ff88",
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.02em",
                userSelect: "none",
              }}
            >
              {initials}
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255, 77, 109, 0.08)",
                border: "1px solid rgba(255, 77, 109, 0.2)",
                borderRadius: 8,
                color: "#ff4d6d",
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 14px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 77, 109, 0.16)";
                e.currentTarget.style.borderColor = "rgba(255, 77, 109, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 77, 109, 0.08)";
                e.currentTarget.style.borderColor = "rgba(255, 77, 109, 0.2)";
              }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 14 }} />
              Sign out
            </button>
          </div>
        )}

        {/* ── Mobile Right: Avatar + Hamburger Toggle ── */}
        {user && (
          <div
            className="flex md:hidden"
            style={{ alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00ff8822, #38bdf844)",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                color: "#00ff88",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {initials}
            </div>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
                borderRadius: 8,
                padding: 6,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mobileMenuOpen ? (
                <CloseRoundedIcon sx={{ fontSize: 20 }} />
              ) : (
                <MenuRoundedIcon sx={{ fontSize: 20 }} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile Dropdown Menu Drawer ── */}
      {user && mobileMenuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(13, 20, 34, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 20px 24px",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* User brief */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 16,
              marginBottom: 16,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00ff8822, #38bdf844)",
                border: "1px solid rgba(0, 255, 136, 0.3)",
                color: "#00ff88",
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {initials}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600 }}>
                {user.name}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user.email}
              </div>
            </div>
          </div>

          {/* Links list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV_LINKS.map(({ to, label, icon }) => {
              const isActive =
                to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 10,
                    color: isActive ? "#00ff88" : "#cbd5e1",
                    background: isActive ? "rgba(0, 255, 136, 0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? "rgba(0, 255, 136, 0.25)" : "rgba(255,255,255,0.04)"}`,
                    textDecoration: "none",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: 14,
                    minHeight: 44,
                  }}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* Mobile Sign out */}
            <button
              onClick={handleLogout}
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(255, 77, 109, 0.12)",
                border: "1px solid rgba(255, 77, 109, 0.3)",
                color: "#ff4d6d",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                minHeight: 44,
                width: "100%",
              }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 18 }} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}