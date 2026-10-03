import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { BookOpen, Plus, Search, ArrowLeft, Archive, FileText, CheckCircle2 } from "../../components/ui/Icons";

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
      .then((r) => {
        setArticles(r.data.data || []);
        setSelected(null);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    api.get("/categories")
      .then((r) => setCategories(r.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    load();
  }, [filterStatus]);

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
      setFormError(err.response?.data?.message || "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  }

  async function handleAction(id, action) {
    try {
      await api.post(`/knowledge/${id}/${action}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengubah status");
    }
  }

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

  if (selected) {
    return (
      <div className="max-w-4xl space-y-6">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Artikel
        </button>

        <Card className="p-8">
          <div className="flex items-start justify-between gap-4 flex-wrap border-b border-slate-100 pb-6 mb-6">
            <div>
              {selected.category_name && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  {selected.category_name}
                </span>
              )}
              <h1 className="text-2xl font-bold text-slate-900 mt-3">{selected.title}</h1>
              <p className="text-xs text-slate-400 mt-1">Ditulis oleh {selected.author_name || "Agen Helpdesk"}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadge(selected.status)}`}>
              {selected.status}
            </span>
          </div>

          <div className="flex gap-2.5 mb-6">
            {selected.status !== "PUBLISHED" && (
              <Button
                variant="primary"
                onClick={() => handleAction(selected.id, "publish")}
                className="flex items-center gap-1.5 text-xs py-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Publikasikan
              </Button>
            )}
            {selected.status === "PUBLISHED" && (
              <Button
                variant="secondary"
                onClick={() => handleAction(selected.id, "archive")}
                className="flex items-center gap-1.5 text-xs py-1.5 text-amber-700"
              >
                <Archive className="w-3.5 h-3.5" />
                Arsipkan
              </Button>
            )}
            {selected.status !== "DRAFT" && (
              <Button
                variant="ghost"
                onClick={() => handleAction(selected.id, "draft")}
                className="flex items-center gap-1.5 text-xs py-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                Kembalikan ke Draft
              </Button>
            )}
          </div>

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-normal">
            {selected.content}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pusat Pengetahuan Agen</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tulis dan kelola dokumentasi solusi untuk referensi agen dan AI Assistant
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(true);
            setFormError("");
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tulis Artikel Baru
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Cari judul panduan..."
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
          <Button variant="secondary" onClick={load}>
            Cari
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 mt-3 font-medium">Memuat daftar artikel...</p>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Belum ada artikel"
          description={q || filterStatus ? "Tidak ada artikel yang cocok dengan filter." : "Tulis artikel panduan pertama untuk membantu rekan tim."}
          actionText={q || filterStatus ? "Reset Pencarian" : "Tulis Artikel"}
          onAction={() => {
            if (q || filterStatus) {
              setQ("");
              setFilterStatus("");
              load();
            } else {
              setShowForm(true);
            }
          }}
        />
      ) : (
        <div className="grid gap-3">
          {articles.map((a) => (
            <Card
              key={a.id}
              onClick={() => setSelected(a)}
              className="p-5 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                {a.category_name && (
                  <span className="text-xs font-semibold text-blue-600">{a.category_name}</span>
                )}
                <p className="font-semibold text-slate-900 mt-0.5 text-base">{a.title}</p>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{a.content}</p>
                <p className="text-xs text-slate-400 mt-3">Penulis: {a.author_name || "Agen"}</p>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(a.status)}`}>
                {a.status}
              </span>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tulis Artikel Solusi Baru"
        maxWidth="max-w-2xl"
      >
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3.5 py-2.5 rounded-lg mb-4">
            {formError}
          </div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Judul Artikel"
            placeholder="Contoh: Solusi Kesalahan Kode 502"
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
              placeholder="Jelaskan alur pemecahan masalah atau panduan troubleshooting..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={8}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none text-slate-800"
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
              {saving ? "Menyimpan..." : "Simpan sebagai Draft"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
