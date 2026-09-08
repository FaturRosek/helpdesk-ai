import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat customer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2 items-end flex-wrap">
        <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded px-3 py-2 text-sm" />
        <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="border rounded px-3 py-2 text-sm" />
        <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60">
          {loading ? "Menyimpan..." : "+ Tambah Customer"}
        </button>
      </form>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Nama</th>
            <th className="p-3">Email</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Company</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.email}</td>
              <td className="p-3">{c.phone || "-"}</td>
              <td className="p-3">{c.company || "-"}</td>
              <td className="p-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${Number(c.is_active) === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {Number(c.is_active) === 1 ? "Aktif" : "Nonaktif"}
                </span>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan={5} className="p-4 text-center text-slate-400">Belum ada customer</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
