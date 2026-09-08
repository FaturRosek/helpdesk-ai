import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  function loadAgents() {
    api.get("/agents").then((res) => setAgents(res.data.data || []));
  }

  useEffect(() => { loadAgents(); }, []);

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

  const initials = (name) => name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agen Dukungan</h1>
          <p className="text-sm text-slate-500 mt-0.5">{agents.length} agen terdaftar</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Tambah Agen
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Tambah Agen Baru</h2>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { key: "name", label: "Nama", placeholder: "Nama lengkap" },
                { key: "email", label: "Email", placeholder: "email@contoh.com", type: "email" },
                { key: "password", label: "Password", placeholder: "••••••••", type: "password" },
                { key: "department", label: "Departemen", placeholder: "Contoh: Technical Support" },
              ].map(({ key, label, placeholder, type = "text" }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required={key !== "department"} />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Tambah Agen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {initials(a.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">{a.name}</p>
              <p className="text-xs text-slate-500 truncate">{a.email}</p>
              {a.department && (
                <span className="inline-block mt-1.5 text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {a.department}
                </span>
              )}
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-xl border border-slate-200">
            <p className="text-3xl mb-2">🛠</p>
            <p className="font-medium">Belum ada agen terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}
