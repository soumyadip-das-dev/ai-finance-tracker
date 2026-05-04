import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark-800 border border-dark-600 rounded-2xl p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">💎</span>
          <h1 className="text-white font-bold text-xl mt-2">FinanceAI</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm(p => ({...p, email: e.target.value}))}
            className="w-full bg-dark-700 border border-dark-600 text-white px-4 py-3 rounded-xl text-sm"
            required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm(p => ({...p, password: e.target.value}))}
            className="w-full bg-dark-700 border border-dark-600 text-white px-4 py-3 rounded-xl text-sm"
            required />
          <button type="submit"
            className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-xl text-sm font-semibold transition-colors mt-2">
            Sign In
          </button>
        </form>
        <p className="text-gray-500 text-sm text-center mt-4">
          No account? <Link to="/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}