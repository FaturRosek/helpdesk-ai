import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

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
      alert(err.response?.data?.message || "Failed to assign agent.");
    }
  }

  async function handleStatus(ticketId, action) {
    try {
      await api.post(`/tickets/${ticketId}/${action}`);
      loadTickets();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    }
  }

  const filtered = tickets.filter((t) => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ticket Queue Control</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Administrative overview, agent workload routing, and status transitions.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={loadTickets}
        >
          Refresh Queue
        </Button>
      </div>

      <Card padding="p-4" className="flex flex-col sm:flex-row gap-3">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        >
          <option value="">All Statuses</option>
          {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        >
          <option value="">All Priorities</option>
          {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </Card>

      <Card padding="p-0" className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton lines={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="No tickets match the selected filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">ID & Subject</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Assigned Agent</th>
                  <th className="px-4 py-3.5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/dashboard/tickets/${t.id}`}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors block"
                      >
                        <span className="font-mono text-blue-600 font-bold mr-1.5">#{t.ticket_number || t.id}</span>
                        {t.subject}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={t.status} size="sm">
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge priority={t.priority} size="sm">
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <select
                        value={t.agent_id || ""}
                        onChange={(e) => handleAssign(t.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-700"
                      >
                        <option value="">Unassigned</option>
                        {agents.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {t.status !== "RESOLVED" && t.status !== "CLOSED" && (
                        <button
                          onClick={() => handleStatus(t.id, "resolve")}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                      {t.status !== "CLOSED" && (
                        <button
                          onClick={() => handleStatus(t.id, "close")}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                        >
                          Close
                        </button>
                      )}
                      <Link
                        to={`/dashboard/tickets/${t.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Open &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
