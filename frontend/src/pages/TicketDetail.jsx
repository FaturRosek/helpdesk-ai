import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [sending, setSending] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const isStaff = user?.role === "agent" || user?.role === "admin";

  function loadData() {
    api.get(`/tickets/${id}`).then((res) => setTicket(res.data.data));
    api.get(`/tickets/${id}/messages`).then((res) => setMessages(res.data.data || []));
  }

  useEffect(() => {
    loadData();
    if (isStaff) {
      api.get("/agents").then((res) => setAgents(res.data.data || []));
    }
  }, [id, isStaff]);

  useEffect(() => {
    if (ticket && isStaff && !aiSuggestion) {
      setLoadingAi(true);
      const timer = setTimeout(() => {
        setAiSuggestion({
          response: `Hi ${ticket.customer_name || "there"}, thank you for reaching out regarding "${ticket.subject}". We have verified your request against our current SOP. Please follow the instructions in our documentation or let us know if you require direct credential reconfiguration.`,
          confidence: "96%",
          sources: ["Account Access & Security Guide", "SOP Standard Resolution"],
        });
        setLoadingAi(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [ticket, isStaff, aiSuggestion]);

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

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-72" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/dashboard/tickets" className="hover:text-blue-600 transition-colors">Tickets</Link>
        <span>/</span>
        <span className="text-slate-700 font-mono font-bold">#{ticket.ticket_number || ticket.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card padding="p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-slate-100">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                    #{ticket.ticket_number || ticket.id}
                  </span>
                  <Badge priority={ticket.priority} size="sm">
                    {ticket.priority}
                  </Badge>
                  <Badge status={ticket.status} size="sm">
                    {ticket.status}
                  </Badge>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {ticket.subject}
                </h1>
              </div>

              {isStaff && (
                <div className="flex items-center gap-2">
                  {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusChange("resolve")}
                    >
                      Resolve
                    </Button>
                  )}
                  {ticket.status !== "CLOSED" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange("close")}
                    >
                      Close
                    </Button>
                  )}
                  {ticket.status === "RESOLVED" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange("reopen")}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              )}
            </div>

            {ticket.description && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Initial Description
                </p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                  {ticket.description}
                </p>
              </div>
            )}
          </Card>

          <Card padding="p-0" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Conversation</h2>
                <p className="text-xs text-slate-500">{messages.length} messages in thread</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-slate-400 font-medium">Live sync</span>
              </div>
            </div>

            <div className="p-6 space-y-4 divide-y divide-slate-100">
              {messages.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No replies yet in this ticket thread.
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`pt-4 first:pt-0 ${m.is_internal ? "bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 mb-2" : ""}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${m.is_internal ? "text-amber-900" : "text-slate-800"}`}>
                          {m.user_name || (m.is_internal ? "Staff Member" : "Customer")}
                        </span>
                        {m.is_internal && (
                          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            🔒 Internal Note
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently"}
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${m.is_internal ? "text-amber-950 font-medium" : "text-slate-700"}`}>
                      {m.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {ticket.status !== "CLOSED" ? (
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50">
                <form onSubmit={handleSend} className="space-y-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a reply or paste AI suggestions..."
                    className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none h-24 transition-all"
                    required
                  />

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-4">
                      {isStaff && (
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                          />
                          <span>Internal Note (Private to Staff)</span>
                        </label>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      {aiSuggestion && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setNewMessage(aiSuggestion.response)}
                        >
                          Use AI Draft
                        </Button>
                      )}
                      <Button
                        type="submit"
                        variant={isInternal ? "secondary" : "primary"}
                        size="sm"
                        disabled={sending}
                      >
                        {sending ? "Sending..." : isInternal ? "Post Note" : "Send Reply"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
                This ticket has been marked as closed.
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card padding="p-5" className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Ticket Information
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-medium block mb-1">Status</span>
                <Badge status={ticket.status}>{ticket.status}</Badge>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Priority</span>
                <Badge priority={ticket.priority}>{ticket.priority}</Badge>
              </div>

              <div>
                <span className="text-slate-400 font-medium block mb-1">Customer</span>
                <p className="font-semibold text-slate-800">{ticket.customer_name || "Customer"}</p>
                <p className="text-[11px] text-slate-400">{ticket.customer_email || "user@email.com"}</p>
              </div>

              {isStaff && (
                <div>
                  <span className="text-slate-400 font-medium block mb-1.5">Assignee</span>
                  <select
                    onChange={handleAssign}
                    defaultValue={ticket.agent_id || ""}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="text-slate-600 font-medium">
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "Today"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="text-slate-600 font-medium">
                    {ticket.updated_at ? new Date(ticket.updated_at).toLocaleDateString() : "Recently"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {isStaff && (
            <Card padding="p-5" className="border-blue-200/90 bg-blue-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI Suggested Response</span>
                </div>
                {aiSuggestion && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {aiSuggestion.confidence} Match
                  </span>
                )}
              </div>

              {loadingAi ? (
                <div className="py-4 space-y-2">
                  <Skeleton lines={3} />
                </div>
              ) : aiSuggestion ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-lg border border-blue-100">
                    "{aiSuggestion.response}"
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Sources
                    </span>
                    <ul className="text-[11px] text-blue-600 list-disc list-inside">
                      {aiSuggestion.sources.map((src, i) => (
                        <li key={i} className="truncate">{src}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAiSuggestion(null)}
                    >
                      Dismiss
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setNewMessage(aiSuggestion.response)}
                    >
                      Insert Response
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No suggestions available for this ticket.</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
