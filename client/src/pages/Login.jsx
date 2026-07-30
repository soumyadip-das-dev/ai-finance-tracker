import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", form);
      login(data);
      toast.success("Logged in");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "#0a0a0f",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Subtle ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 480,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 360, padding: "0 20px" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            color: "#f8fafc",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            Sign in
          </h1>
          <p style={{
            color: "#475569",
            fontSize: 13,
            marginTop: 6,
            letterSpacing: "-0.01em",
          }}>
            Enter your credentials to access your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16,
          padding: "28px 28px 24px",
        }}>
          <form onSubmit={submit}>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: "block",
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
                style={{
                  display: "block",
                  width: "100%",
                  background: "#0d0d14",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  color: "#e2e8f0",
                  fontSize: 13,
                  padding: "10px 13px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: "block",
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 500,
                marginBottom: 6,
                letterSpacing: "0.01em",
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
                style={{
                  display: "block",
                  width: "100%",
                  background: "#0d0d14",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10,
                  color: "#e2e8f0",
                  fontSize: 13,
                  padding: "10px 13px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "block",
                width: "100%",
                background: loading ? "#312e81" : "#4f46e5",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                padding: "11px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "background 0.15s, opacity 0.15s",
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
              }}
              onMouseOver={(e) => { if (!loading) e.target.style.background = "#4338ca"; }}
              onMouseOut={(e) => { if (!loading) e.target.style.background = "#4f46e5"; }}
            >
              {loading ? "Signing in…" : "Continue →"}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          fontSize: 12,
          color: "#475569",
          marginTop: 20,
        }}>
          No account?{" "}
          <Link
            to="/register"
            style={{ color: "#818cf8", textDecoration: "none" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}