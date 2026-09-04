import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ subject: "", description: "", priority: "MEDIUM" });
  const [error, setError] = useState("");

  if (user?.role !== "customer") {
    return (
      <div className="max-w-lg mt-8 p-6 bg-yellow-50 border border-yellow-300 rounded shadow text-center">
        <p className="text-yellow-800 font-semibold text-lg mb-2">⚠️ Akses Ditolak</p>
        <p className="text-yellow-700 text-sm mb-4">
          Hanya pelanggan (<strong>customer</strong>) yang dapat membuat tiket baru.
        </p>
        <Link to="/dashboard/tickets" className="text-indigo-600 text-sm underline">
          ← Kembali ke daftar tiket
        </Link>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/tickets", form);
      navigate("/dashboard/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat tiket");
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Buat Tiket Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-3">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          placeholder="Subjek"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
          required
        />

        <textarea
          placeholder="Jelaskan masalah kamu..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm h-32"
          required
        />

        <select
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
          Submit
        </button>
      </form>
    </div>
  );
}