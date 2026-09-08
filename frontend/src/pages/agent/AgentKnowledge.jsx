import { useEffect, useState } from "react";
import api from "../../services/api";

const STATUS_BADGE = {
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  PUBLISHED: "bg-green-100 text-green-700 border-green-200",
  ARCHIVED: "bg-red-100 text-red-600 border-red-200",
};

export default function AgentKnowledge() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", category_id: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (q) params.q = q;
    api.get("/knowledge", { params })
      .then((r) => { setArticles(r.data.data || []); setSelected(null); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { api.get("/categories").then((r) => setCategories(r.data.data || [])); }, []);
  useEffect(() => { load(); }, [filterStatus]);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await api.post("/knowledge", form);
      setForm({ title: "", content: "", category_id: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(id, action) {
    try { await api.post(`/knowledge/${id}/${action}`); load(); }
    catch (err) { alert(err.response?.data?.message || "Gagal"); }
  }

  /* Detail view */
  if (selected) {
    return (
      <div className="max-w-3xl space-y-5">
        <button onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:underline">
          ← Kembali ke Daftar
        </button>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              {selected.category_name && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">{selected.category_name}</span>
              )}
              <h1 className="text-2xl font-bold text-slate-800 mt-2">{selected.title}</h1>
              <p className="text-xs text-slate-400 mt-1">Oleh {selected.author_name || "—"}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[selected.status]}`}>
              {selected.status}
            </span>
          </div>

          <div className="flex gap-2 mb-6">
            {selected.status !== "PUBLISHED" && (
              <button onClick={() => handleAction(selected.id, "publish")}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                Publish
              </button>
            )}
            {selected.status === "PUBLISHED" && (
              <button onClick={() => handleAction(selected.id, "archive")}
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                Archive
              </button>
            )}
            {selected.status !== "DRAFT" && (
              <button onClick={() => handleAction(selected.id, "draft")}
                className="text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg font-medium transition-colors">
                Ke Draft
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {selected.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-0.5">{articles.length} artikel</p>
        </div>
        <button onClick={() => { setShowForm(true); setFormError(""); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
          + Tulis Artikel
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Cari judul..."
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-52" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button onClick={load}
          className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Cari
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tulis Artikel Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul</label>
                <input placeholder="Judul artikel" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Kategori</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="">— Pilih Kategori —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Isi Artikel</label>
                <textarea placeholder="Tulis isi artikel..." value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" required />
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">Batal</button>
                <button disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors">
                  {saving ? "Menyimpan..." : "Simpan sebagai Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
          <p className="text-4xl mb-3">📝</p>
          <p className="font-medium">Belum ada artikel</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {articles.map((a) => (
            <div key={a.id} onClick={() => setSelected(a)}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md px-6 py-4 cursor-pointer transition-all flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {a.category_name && (
                  <span className="text-xs font-semibold text-indigo-500">{a.category_name}</span>
                )}
                <p className="font-semibold text-slate-800 mt-0.5">{a.title}</p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1 leading-relaxed">{a.content}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_BADGE[a.status]}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
