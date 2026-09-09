import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const TOOL_LABELS = {
  search_tickets:         { icon: "🔍", label: "Mencari tiket..." },
  get_ticket_detail:      { icon: "🎫", label: "Mengambil detail tiket..." },
  create_ticket:          { icon: "✏️",  label: "Membuat tiket baru..." },
  update_ticket_priority: { icon: "🚨", label: "Mengubah prioritas tiket..." },
  update_ticket_status:   { icon: "🔄", label: "Mengubah status tiket..." },
  summarize_ticket:       { icon: "📝", label: "Meringkas tiket..." },
  search_knowledge_base:  { icon: "📚", label: "Mencari knowledge base..." },
  get_categories:         { icon: "🏷️",  label: "Mengambil kategori..." },
  get_ticket_stats:       { icon: "📊", label: "Menganalisis data tiket..." },
};

function ToolCallBadge({ toolCalls }) {
  const [expanded, setExpanded] = useState(false);
  if (!toolCalls || toolCalls.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-full transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {toolCalls.length} tool digunakan {expanded ? "▲" : "▼"}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5">
          {toolCalls.map((tc, i) => {
            const info = TOOL_LABELS[tc.tool] || { icon: "⚙️", label: tc.tool };
            const isSuccess = !tc.result?.error;
            return (
              <div key={i} className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <span>{info.icon}</span>
                  <span>{info.label.replace("...", "")}</span>
                  <span className={`ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {isSuccess ? "✓" : "✗"}
                  </span>
                </div>
                {tc.result?.error && (
                  <p className="text-red-500 mt-0.5">{tc.result.error}</p>
                )}
                {tc.result?.ticket_number && (
                  <p className="text-slate-500 mt-0.5">
                    Tiket: <span className="font-mono font-semibold text-indigo-600">{tc.result.ticket_number}</span>
                  </p>
                )}
                {tc.result?.found !== undefined && (
                  <p className="text-slate-500 mt-0.5">Ditemukan: {tc.result.found} hasil</p>
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
    <div className="mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
      <p className="text-xs font-semibold text-green-700 mb-1">✅ Tiket berhasil dibuat</p>
      <p className="text-xs text-green-600">
        <span className="font-mono font-bold">{r.ticket_number}</span> — {r.subject}
      </p>
      <Link
        to={`/dashboard/tickets`}
        className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
      >
        Lihat tiket saya →
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
  const [sendingTools, setSendingTools] = useState([]); // tools being called
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  function loadConversations() {
    api.get("/ai/conversations").then((r) => setConversations(r.data.data || []));
  }

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingTools]);

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
    const r = await api.post("/ai/conversations", { title: "Percakapan Baru" });
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
    setSendingTools([]);

    // Optimistic user message
    setMessages((prev) => [...prev, { role: "user", content: userMsg, id: Date.now() }]);

    try {
      const r = await api.post(`/ai/conversations/${activeConv.id}/chat`, { message: userMsg });
      const { assistant } = r.data.data;

      // Update conversation title if it changed
      setConversations((prev) => prev.map((c) =>
        c.id === activeConv.id ? { ...c, title: r.data.data?.conversation_title || c.title } : c
      ));

      setMessages((prev) => [...prev, {
        role:       "assistant",
        content:    assistant.content,
        tool_calls: assistant.tool_calls,
        id:         Date.now() + 1,
      }]);

      // Reload conversations to reflect updated title
      loadConversations();

    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal mendapat respons AI";
      setMessages((prev) => [...prev, {
        role:    "assistant",
        content: `⚠️ ${errMsg}`,
        id:      Date.now() + 1,
      }]);
    } finally {
      setSending(false);
      setSendingTools([]);
    }
  }

  async function deleteConversation(id, e) {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Hapus percakapan ini?")) return;
    try {
      await api.delete(`/ai/conversations/${id}`);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConv?.id === id) { setActiveConv(null); setMessages([]); }
    } catch (err) {
      alert("Gagal hapus: " + (err.response?.data?.message || err.message));
    }
  }

  const SUGGESTIONS = [
    "Saya tidak bisa login ke akun saya",
    "Berapa tiket yang masih open?",
    "Cari artikel tentang reset password",
    "Buat tiket untuk masalah jaringan",
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
          <span className="text-[11px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">
          Asisten cerdas yang bisa mengakses data tiket, knowledge base, dan melakukan aksi langsung
        </p>
      </div>

      <div
        className="flex bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        style={{ height: "calc(100vh - 230px)", minHeight: "520px" }}
      >
        {/* Sidebar */}
        <aside className="w-56 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50">
          <div className="p-3 border-b border-slate-100">
            <button
              onClick={startNew}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Percakapan Baru
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <p className="text-xs text-slate-400 text-center mt-6 px-3">Belum ada percakapan</p>
            )}
            {conversations.map((c) => (
              <div
                key={c.id}
                onClick={() => selectConversation(c)}
                className={`px-3 py-2.5 cursor-pointer border-b border-slate-100 flex justify-between items-center group transition-colors ${
                  activeConv?.id === c.id ? "bg-indigo-50 border-l-2 border-l-indigo-500" : "hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeConv?.id === c.id ? "bg-indigo-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-700 truncate">{c.title || "Percakapan"}</span>
                </div>
                <button
                  onClick={(e) => deleteConversation(c.id, e)}
                  title="Hapus"
                  className="shrink-0 ml-1 w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeConv ? (
            /* Empty state with suggestions */
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-slate-400 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mx-auto mb-3">🤖</div>
                <p className="font-semibold text-slate-700 text-lg">HelpDesk AI</p>
                <p className="text-sm mt-1">Saya bisa membantu Anda dengan tiket, knowledge base, dan analisis data</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={async () => {
                      await startNew();
                    }}
                    className="text-sm text-left border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg px-3 py-2.5 text-slate-600 transition-all"
                  >
                    💬 {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">Mulai percakapan baru atau pilih dari daftar di sebelah kiri</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🤖</div>
                  <span className="text-sm font-semibold text-slate-700 truncate max-w-xs">{activeConv.title}</span>
                </div>
                <button
                  onClick={(e) => deleteConversation(activeConv.id, e)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-transparent hover:border-red-200 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {loading && (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {messages.length === 0 && !loading && (
                  <div className="text-center py-10 text-slate-400">
                    <p className="text-sm">Ketik pesan untuk memulai percakapan</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm shrink-0 mb-0.5">🤖</div>
                    )}
                    <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-sm shadow-sm"
                          : "bg-slate-100 text-slate-800 rounded-bl-sm"
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

                {/* Typing indicator */}
                {sending && (
                  <div className="flex justify-start items-end gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm shrink-0">🤖</div>
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm flex flex-col gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <p className="text-xs text-slate-400">AI sedang memproses...</p>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanyakan sesuatu, buat tiket, atau minta analisis data..."
                    disabled={sending}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 disabled:opacity-60 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 shadow-sm flex items-center gap-1.5"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    Kirim
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 px-1">
                  AI dapat mengakses data tiket, knowledge base, dan melakukan aksi sesuai izin role Anda
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
