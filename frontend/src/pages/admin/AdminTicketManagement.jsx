import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const STATUS_COLORS = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-slate-100 text-slate-600",
};

const PRIORITY_COLORS = {
  LOW: "bg-gray-100 text-gray-600",
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
    api.get("/tickets")
      .then((res) => setTickets(res.data.data || []))
      .finally(() => setLoading(false));
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Ticket Management</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Semua Status</option>
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Semua Prioritas</option>
          {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button onClick={loadTickets} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Memuat tiket...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded shadow text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Subjek</th>
                <th className="p-3">Status</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Assign Agent</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs text-slate-500">{t.ticket_number}</td>
                  <td className="p-3">
                    <Link to={`/dashboard/tickets/${t.id}`} className="text-indigo-600 hover:underline">
                      {t.subject}
                    </Link>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[t.status] || ""}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[t.priority] || ""}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      defaultValue={t.agent_id || ""}
                      onChange={(e) => handleAssign(t.id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="">— Pilih Agent —</option>
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 space-x-2">
                    {t.status !== "RESOLVED" && t.status !== "CLOSED" && (
                      <button
                        onClick={() => handleStatus(t.id, "resolve")}
                        className="text-green-600 text-xs hover:underline"
                      >
                        Resolve
                      </button>
                    )}
                    {t.status !== "CLOSED" && (
                      <button
                        onClick={() => handleStatus(t.id, "close")}
                        className="text-red-600 text-xs hover:underline"
                      >
                        Close
                      </button>
                    )}
                    {t.status === "RESOLVED" && (
                      <button
                        onClick={() => handleStatus(t.id, "reopen")}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-slate-400">
                    Tidak ada tiket
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
