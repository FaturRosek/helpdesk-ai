import { useEffect, useState } from "react";
import api from "../services/api";

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  function load(query = "") {
    setLoading(true);
    api.get("/knowledge", { params: { q: query || undefined } })
      .then((r) => { setArticles(r.data.data || []); setSelected(null); })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function handleSearch(e) {
    e.preventDefault();
    load(q);
  }

  if (selected) {
    return (
      <div className="max-w-3xl space-y-5">
        <button
          onClick={() => setSelected(null)}
          className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:underline"
        >
          ← Kembali ke Daftar
        </button>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          {selected.category_name && (
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {selected.category_name}
            </span>
          )}
          <h1 className="text-2xl font-bold text-slate-800 mt-3 mb-2">{selected.title}</h1>
          <p className="text-xs text-slate-400 mb-6">
            Oleh {selected.author_name || "—"} ·{" "}
            {selected.updated_at ? new Date(selected.updated_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : ""}
          </p>
          <div className="border-t border-slate-100 pt-6 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {selected.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Knowledge Base</h1>
        <p className="text-sm text-slate-500 mt-0.5">Temukan jawaban dan panduan dari artikel dukungan kami</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari artikel..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          Cari
        </button>
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); load(); }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Reset
          </button>
        )}
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📖</p>
          <p className="font-medium">Tidak ada artikel ditemukan</p>
          {q && <p className="text-sm mt-1">Coba kata kunci yang berbeda</p>}
        </div>
      ) : (
        <div className="grid gap-3">
          {articles.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelected(a)}
              className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md px-6 py-4 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {a.category_name && (
                    <span className="text-xs font-semibold text-indigo-500">{a.category_name}</span>
                  )}
                  <p className="font-semibold text-slate-800 mt-1">{a.title}</p>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{a.content}</p>
                </div>
                <svg className="w-5 h-5 text-slate-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
