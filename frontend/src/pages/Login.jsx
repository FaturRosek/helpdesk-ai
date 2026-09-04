import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-80 bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Login HelpDesk AI</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-3 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded px-3 py-2 mb-3 text-sm"
          required
        />

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded text-sm">
          Login
        </button>

        <p className="text-xs text-center mt-3">
          Belum punya akun? <Link to="/register" className="text-indigo-600">Daftar</Link>
        </p>
      </form>
    </div>
  );
}