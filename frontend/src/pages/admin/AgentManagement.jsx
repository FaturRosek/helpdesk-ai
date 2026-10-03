import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import { UserCheck, Plus, Mail, Building, ShieldCheck } from "../../components/ui/Icons";

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadAgents() {
    setLoading(true);
    api.get("/agents")
      .then((res) => setAgents(res.data.data || []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAgents();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/agents", form);
      setForm({ name: "", email: "", password: "", department: "" });
      setShowForm(false);
      loadAgents();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat agent");
    }
  }

  const initials = (name) =>
    name?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Agen Dukungan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola agen helpdesk dan penetapan departemen layanan
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(true);
            setError("");
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Agen
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a) => (
          <Card key={a.id} className="p-5 flex items-start gap-4 hover:border-slate-300 transition-colors">
            <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
              {initials(a.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900 truncate">{a.name}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {a.email}
              </p>
              {a.department ? (
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                    <Building className="w-3 h-3" />
                    {a.department}
                  </span>
                </div>
              ) : (
                <div className="mt-2.5 text-[11px] text-slate-400">
                  Umum / Tanpa departemen
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {!loading && agents.length === 0 && (
        <EmptyState
          icon={UserCheck}
          title="Belum ada agen terdaftar"
          description="Tambahkan agen dukungan baru untuk mulai menangani tiket pelanggan."
          actionText="Tambah Agen Sekarang"
          onAction={() => {
            setShowForm(true);
            setError("");
          }}
        />
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tambah Agen Dukungan Baru"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3.5 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Contoh: Budi Santoso"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email Agen"
            type="email"
            placeholder="agen@perusahaan.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Kata Sandi Awal"
            type="password"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Input
            label="Departemen / Divisi"
            placeholder="Contoh: Technical Support, Billing, Tier 2"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
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
              Simpan Agen
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
