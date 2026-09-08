import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const STATUS_STYLE = {
  OPEN: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-100 text-slate-500",
};
const PRIORITY_STYLE = {
  LOW: "bg-slate-100 text-slate-500",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
};

export default function AdminTicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState({ status: "", priority: "" });
  const [loading, setLoading] = useState(true);

  function loadTickets() {
    setLoading(true);
    api.get("/tickets").then((res) => setTickets(res.data.data || [])).finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTickets();
    api.get("/agents").then((res) => setAgents(res.data.data || []));
  }, []);

  async function handleAssign(ticketId, agentId) {
    if (!agentId) return;
    try {
      await api.post(`/tickets/${ticketId}/assign`, { agent_id: Number(agentId) });
      loadTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal assign agent");
    }
  }

  async function handleStatus(ticketId, action) {
    try {
      await api.post(`/tickets/${ticketId}/${action}`);
      loadTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal ubah status");
    }
  }

  const filtered = tickets.filter((t) => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kelola Tiket</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} tiket ditampilkan</p>
        </div>
        <button onClick={loadTickets}
          className="flex items-center gap-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">Semua Status</option>
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">Semua Prioritas</option>
          {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID & Subjek</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Prioritas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Assign Agen</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link to={`/dashboard/tickets/${t.id}`} className="group">
                        <span className="font-mono text-xs text-slate-400">{t.ticket_number}</span>
                        <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-xs">{t.subject}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[t.status] || ""}`}>
                        {t.status === "IN_PROGRESS" ? "In Progress" : t.status?.charAt(0) + t.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${PRIORITY_STYLE[t.priority] || ""}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <select defaultValue={t.agent_id || ""}
                        onChange={(e) => handleAssign(t.id, e.target.value)}
                        className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                        <option value="">— Pilih Agen —</option>
                        {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5 flex-wrap">
                        {t.status !== "RESOLVED" && t.status !== "CLOSED" && (
                          <button onClick={() => handleStatus(t.id, "resolve")}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                            Resolve
                          </button>
                        )}
                        {t.status !== "CLOSED" && (
                          <button onClick={() => handleStatus(t.id, "close")}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors">
                            Tutup
                          </button>
                        )}
                        {t.status === "RESOLVED" && (
                          <button onClick={() => handleStatus(t.id, "reopen")}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors">
                            Buka
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-400">Tidak ada tiket</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
