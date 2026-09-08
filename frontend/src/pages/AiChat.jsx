import { useEffect, useRef, useState } from "react";
import api from "../services/api";

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
  }, [messages]);

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
    setMessages((prev) => [...prev, { role: "user", content: userMsg, id: Date.now() }]);
    try {
      const r = await api.post(`/ai/conversations/${activeConv.id}/chat`, { message: userMsg });
      const { assistant } = r.data.data;
      setMessages((prev) => [...prev, { ...assistant, id: Date.now() + 1 }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal mendapat respons AI";
      setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ ${errMsg}`, id: Date.now() + 1 }]);
    } finally {
      setSending(false);
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
        <p className="text-sm text-slate-500 mt-0.5">Tanyakan apapun seputar layanan dan dukungan teknis</p>
      </div>

      <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>

        {/* Sidebar */}
        <aside className="w-56 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50">
          <div className="p-3 border-b border-slate-100">
            <button onClick={startNew}
              className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
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
              <div key={c.id} onClick={() => selectConversation(c)}
                className={`px-3 py-2.5 cursor-pointer border-b border-slate-100 flex justify-between items-center group transition-colors ${
                  activeConv?.id === c.id
                    ? "bg-indigo-50 border-l-2 border-l-indigo-500"
                    : "hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeConv?.id === c.id ? "bg-indigo-500" : "bg-slate-300"}`} />
                  <span className="text-sm text-slate-700 truncate">{c.title || "Percakapan"}</span>
                </div>
                <button onClick={(e) => deleteConversation(c.id, e)} title="Hapus"
                  className="shrink-0 ml-1 w-5 h-5 rounded flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
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
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">🤖</div>
              <div className="text-center">
                <p className="font-medium text-slate-600">AI Assistant Siap Membantu</p>
                <p className="text-sm mt-1">Pilih percakapan atau mulai yang baru</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🤖</div>
                  <span className="text-sm font-semibold text-slate-700">{activeConv.title}</span>
                </div>
                <button onClick={(e) => deleteConversation(activeConv.id, e)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-transparent hover:border-red-200 transition-all">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {loading && (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {messages.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 pt-10">
                    <p className="text-sm">Ketik pesan untuk memulai percakapan</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5">🤖</div>
                    )}
                    <div className={`max-w-[72%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm shadow-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm shrink-0 mr-2">🤖</div>
                    <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-white">
                <div className="flex gap-2">
                  <input value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder="Ketik pesan..." disabled={sending}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 disabled:opacity-60 transition-all" />
                  <button type="submit" disabled={sending || !input.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 shadow-sm">
                    Kirim
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
