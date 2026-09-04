import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit} className="w-80 bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Daftar Akun Customer</h1>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        {["name", "email", "password", "password_confirmation"].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
            placeholder={field.replace("_", " ")}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border rounded px-3 py-2 mb-3 text-sm"
            required
          />
        ))}

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded text-sm">
          Daftar
        </button>

        <p className="text-xs text-center mt-3">
          Sudah punya akun? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </form>
    </div>
  );
}