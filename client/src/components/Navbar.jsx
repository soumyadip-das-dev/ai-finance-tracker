import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/budgets", label: "Budgets" },
  { to: "/recurring", label: "Recurring" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get initials for avatar
  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(10, 10, 15, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {/* ── Left: Brand ── */}
        <Link
          to="/"
          style={{
            color: "#f8fafc",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "-0.02em",
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          FinanceAI
        </Link>

        {/* ── Center: Nav Links ── */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    color: isActive ? "#e2e8f0" : "#64748b",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    padding: "5px 12px",
                    borderRadius: 8,
                    background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                    transition: "color 0.15s, background 0.15s",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#cbd5e1";
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#64748b";
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

        {/* ── Right: User + Logout ── */}
        {user && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>

            {/* Name + Email */}
            <div style={{ textAlign: "right", display: "none" }} className="sm-show">
              <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {user.name}
              </div>
              <div style={{ color: "#475569", fontSize: 11, marginTop: 1 }}>
                {user.email}
              </div>
            </div>

            {/* Avatar */}
            <div
              title={user.name}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.02em",
                flexShrink: 0,
                cursor: "default",
                userSelect: "none",
              }}
            >
              {initials}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 8,
                color: "#64748b",
                fontSize: 12,
                fontWeight: 500,
                padding: "5px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 0.15s, border-color 0.15s, background 0.15s",
                letterSpacing: "-0.01em",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#f87171";
                e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)";
                e.currentTarget.style.background = "rgba(248,113,113,0.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}