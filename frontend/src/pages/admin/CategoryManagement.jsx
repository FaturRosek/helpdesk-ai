import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", sla_hours: 24 });

  function loadCategories() {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await api.post("/categories", form);
    setForm({ name: "", sla_hours: 24 });
    loadCategories();
  }

  async function handleDelete(id) {
    await api.delete(`/categories/${id}`);
    loadCategories();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-6 flex gap-2 items-end">
        <input placeholder="Nama Kategori" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2 text-sm" required />
        <input type="number" placeholder="SLA (jam)" value={form.sla_hours} onChange={(e) => setForm({ ...form, sla_hours: e.target.value })} className="border rounded px-3 py-2 text-sm w-32" />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">+ Tambah</button>
      </form>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-slate-100 text-left">
          <tr><th className="p-3">Nama</th><th className="p-3">SLA (jam)</th><th className="p-3">Aksi</th></tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.sla_hours}</td>
              <td className="p-3">
                <button onClick={() => handleDelete(c.id)} className="text-red-600 text-xs">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}