import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const TOOL_LABELS = {
  search_tickets:         { icon: "🔍", label: "Searching tickets..." },
  get_ticket_detail:      { icon: "🎫", label: "Fetching ticket details..." },
  create_ticket:          { icon: "✏️",  label: "Creating new ticket..." },
  update_ticket_priority: { icon: "🚨", label: "Updating priority..." },
  update_ticket_status:   { icon: "🔄", label: "Updating status..." },
  summarize_ticket:       { icon: "📝", label: "Summarizing ticket..." },
  search_knowledge_base:  { icon: "📚", label: "Querying knowledge base..." },
  get_categories:         { icon: "🏷️",  label: "Fetching categories..." },
  get_ticket_stats:       { icon: "📊", label: "Analyzing ticket metrics..." },
};

function ToolCallBadge({ toolCalls }) {
  const [expanded, setExpanded] = useState(false);
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{toolCalls.length} tool operations {expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5">
          {toolCalls.map((tc, i) => {
            const info = TOOL_LABELS[tc.tool] || { icon: "⚙️", label: tc.tool };
            const isSuccess = !tc.result?.error;
            return (
              <div key={i} className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-xs">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span>{info.icon}</span>
                  <span>{info.label.replace("...", "")}</span>
                  <span className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isSuccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"}`}>
                    {isSuccess ? "Success" : "Failed"}
                  </span>
                </div>
                {tc.result?.error && (
                  <p className="text-red-600 mt-1">{tc.result.error}</p>
                )}
                {tc.result?.ticket_number && (
                  <p className="text-slate-500 mt-1">
                    Ticket: <span className="font-mono font-bold text-blue-600">#{tc.result.ticket_number}</span>
                  </p>
                )}
                {tc.result?.found !== undefined && (
                  <p className="text-slate-500 mt-1">Found {tc.result.found} matching records</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TicketCreatedNotice({ toolCalls }) {
  const createCall = toolCalls?.find(tc => tc.tool === "create_ticket" && tc.result?.success);
  if (!createCall) return null;
  const r = createCall.result;
  return (
    <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
      <p className="text-xs font-bold text-emerald-800 mb-1">Ticket successfully created</p>
      <p className="text-xs text-emerald-700">
        <span className="font-mono font-bold">#{r.ticket_number}</span> &bull; {r.subject}
      </p>
      <Link
        to="/dashboard/tickets"
        className="text-xs text-blue-600 font-semibold hover:underline mt-1.5 inline-block"
      >
        View in tickets list &rarr;
      </Link>
    </div>
  );
}

export default function AiChat() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  function loadConversations() {
    api.get("/ai/conversations").then((r) => setConversations(r.data.data || []));
  }

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function selectConversation(conv) {
    setActiveConv(conv);
    setLoading(true);
    try {
      const r = await api.get(`/ai/conversations/${conv.id}/messages`);
      setMessages(r.data.data || []);
    } finally {
      setLoading(false);
    }
  }

  async function startNew() {
    const r = await api.post("/ai/conversations", { title: "New Conversation" });
    const conv = r.data.data;
    setConversations((prev) => [conv, ...prev]);
    setActiveConv(conv);
    setMessages([]);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;
    const userMsg = input.trim();
    setInput("");
    setSending(true);

    setMessages((prev) => [...prev, { role: "user", content: userMsg, id: Date.now() }]);

    try {
      const r = await api.post(`/ai/conversations/${activeConv.id}/chat`, { message: userMsg });
      const { assistant } = r.data.data;

      setConversations((prev) => prev.map((c) =>
        c.id === activeConv.id ? { ...c, title: r.data.data?.conversation_title || c.title } : c
      ));

      setMessages((prev) => [...prev, {
        role:       "assistant",
        content:    assistant.content,
        tool_calls: assistant.tool_calls,
        id:         Date.now() + 1,
      }]);

      loadConversations();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to retrieve AI response";
      setMessages((prev) => [...prev, {
        role:    "assistant",
        content: `Error: ${errMsg}`,
        id:      Date.now() + 1,
      }]);
    } finally {
      setSending(false);
    }
  }

  async function deleteConversation(id, e) {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Delete this conversation?")) return;
    try {
      await api.delete(`/ai/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConv?.id === id) { setActiveConv(null); setMessages([]); }
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  }

  const SUGGESTIONS = [
    "How do I reset my account credentials?",
    "Summarize all currently open tickets",
    "Look up standard resolution for network connectivity",
    "Create a high priority ticket for database latency",
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Assistant</h1>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
            Workspace Copilot
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Ask AI anything about your support work, ticket status, or knowledge base documentation.
        </p>
      </div>

      <Card padding="p-0" className="flex overflow-hidden h-[calc(100vh-210px)] min-h-[520px]">
        <aside className="w-60 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/60">
          <div className="p-3 border-b border-slate-200 bg-white">
            <Button
              onClick={startNew}
              className="w-full text-xs py-2"
              variant="primary"
            >
              + New Conversation
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.length === 0 && (
              <p className="text-xs text-slate-400 text-center mt-8 px-4">No conversations yet.</p>
            )}
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => selectConversation(c)}
                className={`px-3 py-3 cursor-pointer flex justify-between items-center group transition-colors ${
                  activeConv?.id === c.id
                    ? "bg-blue-50/70 border-l-4 border-blue-600 font-semibold text-blue-700"
                    : "hover:bg-slate-100 text-slate-700 border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-xs truncate">{c.title || "Conversation"}</span>
                </div>
                <button
                  onClick={(e) => deleteConversation(c.id, e)}
                  className="shrink-0 ml-1 p-1 rounded text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete conversation"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-xs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Intelligent Support Workspace</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                Connected to your organization's documentation, tickets, and automated workflow triggers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md text-left">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={async () => {
                      await startNew();
                    }}
                    className="p-3 text-xs bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 border border-slate-200 rounded-lg text-slate-700 transition-all cursor-pointer"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="h-14 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-xs">{activeConv.title}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => deleteConversation(activeConv.id, e)}
                    className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    Delete chat
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loading && (
                  <div className="flex justify-center py-6">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {messages.length === 0 && !loading && (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Ask a question or enter a command below.
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-start gap-2.5`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    )}
                    <div className={`max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`px-4 py-3 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-800 border border-slate-200/80"
                      }`}>
                        {msg.content}
                      </div>
                      {msg.role === "assistant" && (
                        <>
                          <ToolCallBadge toolCalls={msg.tool_calls} />
                          <TicketCreatedNotice toolCalls={msg.tool_calls} />
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="flex justify-start items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs text-slate-500">
                      Processing query with authorized tools & RAG...
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI anything about tickets, knowledge base, or customer questions..."
                    disabled={sending}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                  <Button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="py-2.5 px-4 text-xs"
                  >
                    Send
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
