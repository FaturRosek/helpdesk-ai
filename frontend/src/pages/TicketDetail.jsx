import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const STATUS_STYLE = {
  OPEN: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  RESOLVED: "bg-green-100 text-green-700 border-green-200",
  CLOSED: "bg-slate-100 text-slate-500 border-slate-200",
};
const PRIORITY_STYLE = {
  LOW: "bg-slate-100 text-slate-500",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
};

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [sending, setSending] = useState(false);

  const isStaff = user?.role === "agent" || user?.role === "admin";

  function loadData() {
    api.get(`/tickets/${id}`).then((res) => setTicket(res.data.data));
    api.get(`/tickets/${id}/messages`).then((res) => setMessages(res.data.data || []));
  }

  useEffect(() => {
    loadData();
    if (isStaff) api.get("/agents").then((res) => setAgents(res.data.data || []));
  }, [id]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await api.post(`/tickets/${id}/messages`, { message: newMessage, is_internal: isInternal });
      setNewMessage("");
      setIsInternal(false);
      loadData();
    } finally {
      setSending(false);
    }
  }

  async function handleAssign(e) {
    await api.post(`/tickets/${id}/assign`, { agent_id: e.target.value });
    loadData();
  }

  async function handleStatusChange(action) {
    await api.post(`/tickets/${id}/${action}`);
    loadData();
  }

  if (!ticket) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const statusLabel = ticket.status === "IN_PROGRESS" ? "In Progress" : ticket.status?.charAt(0) + ticket.status?.slice(1).toLowerCase();

  return (
    <div className="max-w-3xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/dashboard/tickets" className="hover:text-indigo-600 transition-colors">Tiket</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{ticket.ticket_number}</span>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">{ticket.ticket_number}</span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[ticket.status] || ""}`}>
                {statusLabel}
              </span>
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${PRIORITY_STYLE[ticket.priority] || ""}`}>
                {ticket.priority}
              </span>
            </div>
          </div>
          {isStaff && (
            <div className="flex gap-2 flex-wrap shrink-0">
              {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
                <button
                  onClick={() => handleStatusChange("resolve")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  ✓ Resolve
                </button>
              )}
              {ticket.status !== "CLOSED" && (
                <button
                  onClick={() => handleStatusChange("close")}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Tutup
                </button>
              )}
              {ticket.status === "RESOLVED" && (
                <button
                  onClick={() => handleStatusChange("reopen")}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Buka Kembali
                </button>
              )}
            </div>
          )}
        </div>

        {ticket.description && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed">{ticket.description}</p>
          </div>
        )}
      </div>

      {/* Assign agent */}
      {isStaff && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Assign ke Agen</label>
          <select
            onChange={handleAssign}
            defaultValue={ticket.agent_id || ""}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">— Pilih Agen —</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Messages */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Percakapan</h2>
          <p className="text-xs text-slate-400 mt-0.5">{messages.length} pesan</p>
        </div>

        <div className="divide-y divide-slate-100">
          {messages.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm">Belum ada percakapan</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`px-5 py-4 ${m.is_internal ? "bg-amber-50" : ""}`}>
                {m.is_internal && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mb-2">
                    🔒 Catatan Internal
                  </span>
                )}
                <p className="text-sm text-slate-700 leading-relaxed">{m.message}</p>
                <p className="text-xs text-slate-400 mt-1.5">
                  {m.created_at ? new Date(m.created_at).toLocaleString("id-ID") : "—"}
                </p>
              </div>
            ))
          )}
        </div>

        {ticket.status !== "CLOSED" && (
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
            <form onSubmit={handleSend} className="space-y-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tulis balasan..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none h-20 bg-white"
                required
              />
              <div className="flex items-center justify-between gap-3">
                {isStaff && (
                  <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    Catatan internal (tidak terlihat customer)
                  </label>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ml-auto"
                >
                  {sending ? "Mengirim..." : "Kirim Balasan"}
                </button>
              </div>
            </form>
          </div>
        )}
        {ticket.status === "CLOSED" && (
          <div className="px-5 py-4 border-t border-slate-100 text-center text-sm text-slate-400">
            Tiket ini telah ditutup
          </div>
        )}
      </div>
    </div>
  );
}
