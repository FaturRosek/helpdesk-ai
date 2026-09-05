import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");

  function loadAgents() {
    api.get("/agents").then((res) => setAgents(res.data.data));
  }

  useEffect(() => { loadAgents(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/agents", form);
      setForm({ name: "", email: "", password: "", department: "" });
      loadAgents();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat agent");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Agent Management</h1>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2 items-end flex-wrap">
        <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border rounded px-3 py-2 text-sm" />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">+ Tambah Agent</button>
      </form>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr><th className="p-3">Nama</th><th className="p-3">Email</th><th className="p-3">Department</th></tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-3">{a.name}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3">{a.department || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}