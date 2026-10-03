import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

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
      <div className="max-w-3xl space-y-6">
        <button
          onClick={() => setSelected(null)}
          className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
        >
          &larr; Back to all articles
        </button>

        <Card padding="p-8" className="space-y-4">
          <div className="space-y-2 pb-4 border-b border-slate-100">
            {selected.category_name && (
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                {selected.category_name}
              </span>
            )}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight pt-1">
              {selected.title}
            </h1>
            <p className="text-xs text-slate-400">
              Author: <span className="text-slate-600 font-medium">{selected.author_name || "Support Team"}</span> &bull; Last updated:{" "}
              {selected.updated_at ? new Date(selected.updated_at).toLocaleDateString() : "Recently"}
            </p>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap pt-2">
            {selected.content}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Find verified documentation, troubleshooting steps, and standard operating procedures.
        </p>
      </div>

      <Card padding="p-5" className="bg-gradient-to-r from-blue-50/60 to-slate-50 border-blue-100/80">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
          <Button type="submit" size="md">
            Search
          </Button>
          {q && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => { setQ(""); load(); }}
            >
              Reset
            </Button>
          )}
        </form>
      </Card>

      {loading ? (
        <div className="space-y-3">
          <Skeleton lines={4} />
        </div>
      ) : articles.length === 0 ? (
        <Card padding="p-6">
          <EmptyState
            title="No knowledge articles found"
            description={q ? `No articles matching "${q}". Try different search terms.` : "No documentation articles available."}
            action={
              q && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { setQ(""); load(); }}
                >
                  Clear Search
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((a) => (
            <Card
              key={a.id}
              padding="p-5"
              onClick={() => setSelected(a)}
              className="cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-0">
                  {a.category_name && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {a.category_name}
                    </span>
                  )}
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {a.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {a.content}
                  </p>
                </div>
                <span className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1">
                  &rarr;
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
