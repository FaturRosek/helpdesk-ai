import { useEffect, useState } from "react";
import api from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  function loadUsers() {
    api.get("/users").then((res) => setUsers(res.data.data || []));
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", password: "", role: "customer" });
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat user");
    }
  }

  async function toggleActive(id) {
    await api.patch(`/users/${id}/activate`);
    loadUsers();
  }

  const ROLE_BADGE = {
    admin: "bg-amber-100 text-amber-700",
    agent: "bg-blue-100 text-blue-700",
    customer: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} pengguna terdaftar</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Tambah User
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tambah User Baru</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama</label>
                <input placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <input type="email" placeholder="email@contoh.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Tambah User
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
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nama</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-800">{u.name}</td>
                <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${ROLE_BADGE[u.role] || "bg-slate-100 text-slate-500"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${Number(u.is_active) === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {Number(u.is_active) === 1 ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => toggleActive(u.id)}
                    className={`text-xs font-medium px-3 py-1 rounded-lg border transition-colors ${
                      Number(u.is_active) === 1
                        ? "border-red-200 text-red-600 hover:bg-red-50"
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {Number(u.is_active) === 1 ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">Belum ada pengguna</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
