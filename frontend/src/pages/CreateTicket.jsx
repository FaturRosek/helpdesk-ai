import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ subject: "", description: "", priority: "MEDIUM" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role !== "customer") {
    return (
      <div className="max-w-lg">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-2xl mb-3">⚠️</p>
          <p className="font-semibold text-amber-800 text-lg mb-2">Akses Ditolak</p>
          <p className="text-amber-700 text-sm mb-4">
            Hanya pelanggan (<strong>customer</strong>) yang dapat membuat tiket baru.
          </p>
          <Link to="/dashboard/tickets" className="text-indigo-600 text-sm font-medium hover:underline">
            ← Kembali ke daftar tiket
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/tickets", form);
      navigate("/dashboard/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat tiket");
    } finally {
      setLoading(false);
    }
  }

  const PRIORITIES = [
    { value: "LOW", label: "Rendah", desc: "Tidak mendesak" },
    { value: "MEDIUM", label: "Sedang", desc: "Perlu ditangani segera" },
    { value: "HIGH", label: "Tinggi", desc: "Masalah signifikan" },
    { value: "URGENT", label: "Urgent", desc: "Butuh respon segera" },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Buat Tiket Baru</h1>
        <p className="text-sm text-slate-500 mt-0.5">Jelaskan masalah yang Anda alami dan tim kami akan segera membantu</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjek</label>
            <input
              placeholder="Deskripsikan masalah secara singkat..."
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
            <textarea
              placeholder="Jelaskan masalah Anda secara detail. Semakin detail, semakin cepat kami bisa membantu..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all resize-none h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Prioritas</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRIORITIES.map((p) => (
                <label
                  key={p.value}
                  className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                    form.priority === p.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={form.priority === p.value}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="sr-only"
                  />
                  <p className="font-semibold text-sm text-slate-800">{p.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {loading ? "Mengirim..." : "Kirim Tiket"}
            </button>
            <Link
              to="/dashboard/tickets"
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
