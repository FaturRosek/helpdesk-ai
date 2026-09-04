import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [agents, setAgents] = useState([]);

  const isStaff = user.role === "agent" || user.role === "admin";

  function loadData() {
    api.get(`/tickets/${id}`).then((res) => setTicket(res.data.data));
    api.get(`/tickets/${id}/messages`).then((res) => setMessages(res.data.data));
  }

  useEffect(() => {
    loadData();
    if (isStaff) {
      api.get("/agents").then((res) => setAgents(res.data.data));
    }
  }, [id]);

  async function handleSend(e) {
    e.preventDefault();
    await api.post(`/tickets/${id}/messages`, { message: newMessage, is_internal: isInternal });
    setNewMessage("");
    setIsInternal(false);
    loadData();
  }

  async function handleAssign(e) {
    await api.post(`/tickets/${id}/assign`, { agent_id: e.target.value });
    loadData();
  }

  async function handleStatusChange(action) {
    await api.post(`/tickets/${id}/${action}`);
    loadData();
  }

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-start mb-1">
        <h1 className="text-xl font-bold">{ticket.subject}</h1>
        <span className="text-xs px-2 py-1 bg-slate-200 rounded">{ticket.status}</span>
      </div>
      <p className="text-sm text-slate-500 mb-4">{ticket.ticket_number} — Priority: {ticket.priority}</p>
      <p className="text-sm mb-6">{ticket.description}</p>

      {isStaff && (
        <div className="mb-4 bg-white p-4 rounded shadow text-sm">
          <label className="block mb-1 font-medium">Assign ke Agent</label>
          <select onChange={handleAssign} defaultValue={ticket.agent_id || ""} className="border rounded px-3 py-2 w-full">
            <option value="">-- Pilih Agent --</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}

      {isStaff && (
        <div className="mb-6 flex gap-2">
          {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
            <button onClick={() => handleStatusChange("resolve")} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm">
              Resolve
            </button>
          )}
          {ticket.status !== "CLOSED" && (
            <button onClick={() => handleStatusChange("close")} className="bg-slate-600 text-white px-3 py-1.5 rounded text-sm">
              Close
            </button>
          )}
          {ticket.status === "RESOLVED" && (
            <button onClick={() => handleStatusChange("reopen")} className="bg-amber-600 text-white px-3 py-1.5 rounded text-sm">
              Reopen
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded shadow p-4 space-y-3 mb-4">
        {messages.map((m) => (
          <div key={m.id} className={`border-b pb-2 text-sm ${m.is_internal ? "bg-yellow-50" : ""}`}>
            {m.is_internal ? <span className="text-xs font-bold text-yellow-700">[INTERNAL NOTE] </span> : null}
            <p className="inline">{m.message}</p>
            <div className="text-xs text-slate-400">{m.created_at}</div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-slate-400 text-sm">Belum ada percakapan.</p>}
      </div>

      {ticket.status !== "CLOSED" && (
        <form onSubmit={handleSend} className="space-y-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tulis balasan..."
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />

          {isStaff && (
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} />
              Catatan internal (tidak terlihat customer)
            </label>
          )}

          <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">Kirim</button>
        </form>
      )}
    </div>
  );
}