import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function loadCustomers() {
    api.get("/customers").then((res) => setCustomers(res.data.data || []));
  }

  useEffect(() => { loadCustomers(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/customers", form);
      setForm({ name: "", email: "", password: "", phone: "", company: "" });
      setShowForm(false);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat customer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pelanggan</h1>
          <p className="text-sm text-slate-500 mt-0.5">{customers.length} pelanggan terdaftar</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Tambah Pelanggan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tambah Pelanggan Baru</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { key: "name", label: "Nama", placeholder: "Nama lengkap" },
                { key: "email", label: "Email", placeholder: "email@contoh.com", type: "email" },
                { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
                { key: "phone", label: "No. Telepon", placeholder: "08xx-xxxx-xxxx" },
                { key: "company", label: "Perusahaan", placeholder: "Nama perusahaan" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required={key === "name" || key === "email" || key === "password"} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60">
                  {loading ? "Menyimpan..." : "Tambah Pelanggan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Nama", "Email", "Telepon", "Perusahaan", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-800">{c.name}</td>
                <td className="px-5 py-3.5 text-slate-500">{c.email}</td>
                <td className="px-5 py-3.5 text-slate-500">{c.phone || "—"}</td>
                <td className="px-5 py-3.5 text-slate-500">{c.company || "—"}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${Number(c.is_active) === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {Number(c.is_active) === 1 ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Belum ada pelanggan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
