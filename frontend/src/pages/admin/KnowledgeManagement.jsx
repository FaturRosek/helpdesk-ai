import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { BookOpen, Plus, Search, Edit3, Trash2, CheckCircle2, Archive, FileText } from "../../components/ui/Icons";

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
    api.get("/knowledge", { params })
      .then((r) => setArticles(r.data.data || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    api.get("/categories")
      .then((r) => setCategories(r.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadArticles();
  }, [filterStatus]);

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
      if (editing) {
        await api.put(`/knowledge/${editing.id}`, form);
      } else {
        await api.post("/knowledge", form);
      }
      setShowForm(false);
      loadArticles();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(id, action) {
    try {
      await api.post(`/knowledge/${id}/${action}`);
      loadArticles();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah status");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus artikel ini?")) return;
    try {
      await api.delete(`/knowledge/${id}`);
      loadArticles();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  }

  const filtered = articles.filter((a) =>
    filterQ ? a.title.toLowerCase().includes(filterQ.toLowerCase()) : true
  );

  function getStatusBadge(status) {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ARCHIVED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola, publikasikan, dan arsipkan artikel panduan untuk agen dan pelanggan
          </p>
        </div>
        <Button variant="primary" onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Artikel Baru
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              placeholder="Cari judul artikel..."
              value={filterQ}
              onChange={(e) => setFilterQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadArticles()}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors text-slate-700"
          >
            <option value="">Semua Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <Button variant="secondary" onClick={loadArticles}>
            Cari
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400 mt-3 font-medium">Memuat artikel...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={BookOpen}
              title="Tidak ada artikel ditemukan"
              description={filterQ || filterStatus ? "Tidak ada artikel yang sesuai kriteria pencarian Anda." : "Mulai dengan membuat artikel panduan pertama."}
              actionText={filterQ || filterStatus ? "Reset Pencarian" : "Tulis Artikel Baru"}
              onAction={() => {
                if (filterQ || filterStatus) {
                  setFilterQ("");
                  setFilterStatus("");
                  loadArticles();
                } else {
                  openCreate();
                }
              }}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Judul Artikel</th>
                  <th className="px-6 py-3.5">Kategori</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Penulis</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-sm">{a.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-sm">{a.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      {a.category_name ? (
                        <span className="inline-block text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {a.category_name}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {a.author_name || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {a.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handleAction(a.id, "publish")}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Publikasikan"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {a.status === "PUBLISHED" && (
                          <button
                            onClick={() => handleAction(a.id, "archive")}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Arsipkan"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        {a.status !== "DRAFT" && (
                          <button
                            onClick={() => handleAction(a.id, "draft")}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Jadikan Draft"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? "Edit Artikel Knowledge" : "Tambah Artikel Baru"}
        maxWidth="max-w-3xl"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3.5 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Judul Artikel"
            placeholder="Contoh: Cara Melakukan Reset Kata Sandi"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors text-slate-800"
            >
              <option value="">— Pilih Kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Isi Konten Artikel
            </label>
            <textarea
              placeholder="Tuliskan langkah-langkah atau penjelasan bantuan secara rinci..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={9}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none leading-relaxed text-slate-800"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Artikel"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
