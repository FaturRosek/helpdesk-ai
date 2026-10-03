import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { Tag, Clock, Plus, Trash2 } from "../../components/ui/Icons";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", sla_hours: 24 });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadCategories() {
    setLoading(true);
    api.get("/categories")
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCategories();
  }, []);

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kategori Tiket & SLA</h1>
          <p className="text-sm text-slate-500 mt-1">
            Konfigurasi kategori masalah dan batas waktu target penyelesaian (SLA)
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.id} className="p-5 flex items-center justify-between group hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{c.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>SLA Target: <strong className="text-slate-700 font-semibold">{c.sla_hours} Jam</strong></span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus Kategori"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>

      {!loading && categories.length === 0 && (
        <EmptyState
          icon={Tag}
          title="Belum ada kategori tiket"
          description="Tambahkan kategori awal seperti Technical, Billing, atau Akun."
          actionText="Tambah Kategori Sekarang"
          onAction={() => setShowForm(true)}
        />
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tambah Kategori Baru"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Kategori"
            placeholder="Contoh: Pembayaran, Bug Aplikasi, Jaringan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Target SLA Penyelesaian (Jam)"
            type="number"
            min={1}
            value={form.sla_hours}
            onChange={(e) => setForm({ ...form, sla_hours: Number(e.target.value) })}
            helperText="Waktu maksimal yang diharapkan untuk menyelesaikan tiket kategori ini"
            required
          />
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Kategori
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
