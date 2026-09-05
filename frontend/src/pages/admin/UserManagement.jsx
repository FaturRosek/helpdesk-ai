import { useEffect, useState } from "react";
import api from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");

  function loadUsers() {
    api.get("/users").then((res) => setUsers(res.data.data));
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", password: "", role: "customer" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat user");
    }
  }

  async function toggleActive(id) {
    await api.patch(`/users/${id}/activate`);
    loadUsers();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2 items-end flex-wrap">
        <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border rounded px-3 py-2 text-sm">
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">+ Tambah User</button>
      </form>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr><th className="p-3">Nama</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">{u.is_active ? "Aktif" : "Nonaktif"}</td>
              <td className="p-3">
                <button onClick={() => toggleActive(u.id)} className="text-indigo-600 text-xs">
                  {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}