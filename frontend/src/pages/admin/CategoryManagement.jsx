import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", sla_hours: 24 });
  const [showForm, setShowForm] = useState(false);

  function loadCategories() {
    api.get("/categories").then((res) => setCategories(res.data.data || []));
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await api.post("/categories", form);
    setForm({ name: "", sla_hours: 24 });
    setShowForm(false);
    loadCategories();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus kategori ini?")) return;
    await api.delete(`/categories/${id}`);
    loadCategories();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kategori</h1>
          <p className="text-sm text-slate-500 mt-0.5">{categories.length} kategori terdaftar</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Tambah Kategori
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tambah Kategori</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Kategori</label>
                <input placeholder="Contoh: Billing, Technical" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">SLA (jam)</label>
                <input type="number" value={form.sla_hours} min={1}
                  onChange={(e) => setForm({ ...form, sla_hours: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between group">
            <div>
              <p className="font-semibold text-slate-800">{c.name}</p>
              <p className="text-xs text-slate-400 mt-1">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  SLA: {c.sla_hours} jam
                </span>
              </p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="opacity-0 group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all"
            >
              Hapus
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            <p className="text-3xl mb-2">🗂</p>
            <p className="font-medium">Belum ada kategori</p>
          </div>
        )}
      </div>
    </div>
  );
}
