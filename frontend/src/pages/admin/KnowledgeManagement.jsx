import { useEffect, useState } from "react";
import api from "../../services/api";

const STATUS_BADGE = {
  DRAFT: "bg-slate-100 text-slate-600",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-red-100 text-red-600",
};

export default function KnowledgeManagement() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterQ, setFilterQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", category_id: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function loadArticles() {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterQ) params.q = filterQ;
    api.get("/knowledge", { params }).then((r) => setArticles(r.data.data || [])).finally(() => setLoading(false));
  }

  useEffect(() => { api.get("/categories").then((r) => setCategories(r.data.data || [])); }, []);
  useEffect(() => { loadArticles(); }, [filterStatus]);

  function openCreate() {
    setEditing(null);
    setForm({ title: "", content: "", category_id: "" });
    setError("");
    setShowForm(true);
  }

  function openEdit(article) {
    setEditing(article);
    setForm({ title: article.title, content: article.content, category_id: article.category_id || "" });
    setError("");
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      editing ? await api.put(`/knowledge/${editing.id}`, form) : await api.post("/knowledge", form);
      setShowForm(false);
      loadArticles();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(id, action) {
    try { await api.post(`/knowledge/${id}/${action}`); loadArticles(); }
    catch (err) { alert(err.response?.data?.message || "Gagal"); }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus artikel ini?")) return;
    try { await api.delete(`/knowledge/${id}`); loadArticles(); }
    catch (err) { alert(err.response?.data?.message || "Gagal menghapus"); }
  }

  const filtered = articles.filter((a) => filterQ ? a.title.toLowerCase().includes(filterQ.toLowerCase()) : true);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Knowledge CRUD</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} artikel</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
          + Artikel Baru
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input placeholder="Cari judul..." value={filterQ}
            onChange={(e) => setFilterQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadArticles()}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-52" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <button onClick={loadArticles}
          className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Cari
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">{editing ? "Edit Artikel" : "Artikel Baru"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul</label>
                <input placeholder="Judul artikel" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50">Batal</button>
                <button disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 transition-colors">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Judul", "Kategori", "Status", "Penulis", "Aksi"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800 max-w-xs truncate">{a.title}</td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{a.category_name || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[a.status]}`}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{a.author_name || "—"}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => openEdit(a)} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors">Edit</button>
                      {a.status !== "PUBLISHED" && (
                        <button onClick={() => handleAction(a.id, "publish")} className="text-xs px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">Publish</button>
                      )}
                      {a.status === "PUBLISHED" && (
                        <button onClick={() => handleAction(a.id, "archive")} className="text-xs px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-colors">Archive</button>
                      )}
                      {a.status !== "DRAFT" && (
                        <button onClick={() => handleAction(a.id, "draft")} className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100 transition-colors">Draft</button>
                      )}
                      <button onClick={() => handleDelete(a.id)} className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">Belum ada artikel</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
