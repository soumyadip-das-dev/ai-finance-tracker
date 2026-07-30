import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit registration
  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/register", form);
      login(data);
      toast.success("Welcome to FinanceAI! Your account is created.");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please check details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] grid grid-cols-1 lg:grid-cols-12 overflow-hidden text-slate-100 font-sans">
      
      {/* ── LEFT PANE (VISUAL PANEL) ── */}
      <div className="hidden lg:flex lg:col-span-7 bg-[#0d1422] flex-col justify-between p-16 relative overflow-hidden border-r border-[#1a2332]">
        
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#7c6af7]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#22d3a5]/10 blur-[100px] pointer-events-none" />
        
        {/* SVG Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a2332_1px,transparent_1px),linear-gradient(to_bottom,#1a2332_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* Logo Header */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7c6af7] to-[#22d3a5] flex items-center justify-center shadow-lg shadow-[#7c6af7]/20">
            <span className="text-xl">💎</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide font-display">
            FinanceAI
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="my-auto relative z-10 max-w-xl">
          <h2 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Take control of your <br/>
            <span className="bg-gradient-to-r from-[#7c6af7] via-[#38bdf8] to-[#22d3a5] bg-clip-text text-transparent">
              financial future.
            </span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
            An industry-grade expense tracker and automated planner powered by Gemini AI. Connect, track, and optimize with ease.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-lg bg-[#1a2332] flex items-center justify-center shrink-0 border border-[#243044] text-[#38bdf8]">
                📊
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Real-time Dashboard</h4>
                <p className="text-slate-400 text-xs mt-1">Monitor income vs. expenses, analyze trends, and view automated breakdown charts instantly.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-lg bg-[#1a2332] flex items-center justify-center shrink-0 border border-[#243044] text-[#22d3a5]">
                🤖
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Gemini AI Assistant</h4>
                <p className="text-slate-400 text-xs mt-1">Get custom, actionable tips and real-time alerts generated directly by artificial intelligence.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-lg bg-[#1a2332] flex items-center justify-center shrink-0 border border-[#243044] text-[#7c6af7]">
                🔁
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Recurring Transactions & Budgets</h4>
                <p className="text-slate-400 text-xs mt-1">Set monthly category limits and schedule recurring bills to fully automate your logging flow.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-slate-500 text-xs relative z-10">
          &copy; {new Date().getFullYear()} FinanceAI. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANE (REGISTER FORM) ── */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center items-center p-6 md:p-12 relative">
        
        {/* Mobile Background Glows */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#7c6af7]/5 blur-[80px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#22d3a5]/5 blur-[80px]" />
        </div>

        {/* Mobile Logo Header */}
        <div className="lg:hidden flex items-center gap-3 mb-10 z-10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#7c6af7] to-[#22d3a5] flex items-center justify-center">
            <span className="text-lg">💎</span>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            FinanceAI
          </span>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="w-full max-w-md bg-[#0d1422]/60 backdrop-blur-xl border border-[#1a2332] rounded-3xl p-8 md:p-10 shadow-2xl relative z-10">
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Create Account
            </h3>
            <p className="text-slate-400 text-xs mt-2">
              Sign up today and start optimizing your spending
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-semibold">Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#12121a] border border-[#252535] text-white px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]/20 placeholder:text-slate-600"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#12121a] border border-[#252535] text-white px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]/20 placeholder:text-slate-600"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-slate-300 text-xs font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#12121a] border border-[#252535] text-white px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:border-[#7c6af7] focus:ring-1 focus:ring-[#7c6af7]/20 placeholder:text-slate-600"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7c6af7] to-[#6b58f0] hover:from-[#6b58f0] hover:to-[#5a47e0] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#7c6af7]/10 hover:shadow-[#7c6af7]/20 transform active:scale-[0.98] mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          {/* Login Redirect Footer */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#38bdf8] hover:text-[#7c6af7] font-semibold transition-colors duration-150"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}