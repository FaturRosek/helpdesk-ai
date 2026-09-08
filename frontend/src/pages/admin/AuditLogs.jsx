import { useEffect, useState } from "react";
import api from "../../services/api";

function statusColor(code) {
  if (code >= 500) return "text-red-600 bg-red-50 border-red-200";
  if (code >= 400) return "text-orange-600 bg-orange-50 border-orange-200";
  if (code >= 200 && code < 300) return "text-green-700 bg-green-50 border-green-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [module, setModule] = useState("");
  const [loading, setLoading] = useState(true);

  function loadLogs(p = 1, mod = "") {
    setLoading(true);
    api.get("/audit-logs", { params: { page: p, per_page: 30, module: mod || undefined } })
      .then((res) => {
        const d = res.data.data;
        setLogs(d.logs || []);
        setTotal(d.total || 0);
        setLastPage(d.last_page || 1);
        setPage(p);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadLogs(1, module); }, []);

  function handleFilter(e) {
    e.preventDefault();
    loadLogs(1, module);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analitik SLA & Audit Log</h1>
        <p className="text-sm text-slate-500 mt-0.5">Total {total} entri tercatat</p>
      </div>

      {/* Filter */}
      <form onSubmit={handleFilter} className="flex gap-3 flex-wrap">
        <div className="relative">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <input placeholder="Filter modul (contoh: tickets)" value={module}
            onChange={(e) => setModule(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white w-60" />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Filter
        </button>
        <button type="button" onClick={() => { setModule(""); loadLogs(1, ""); }}
          className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Reset
        </button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Waktu", "User", "Modul", "Aksi", "Path", "Status", "IP"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {l.created_at ? new Date(l.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {l.user_name ? (
                        <div>
                          <p className="font-medium text-slate-700 text-xs">{l.user_name}</p>
                          <p className="text-slate-400 text-[11px]">{l.user_email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">Guest</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full">
                        {l.module || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono uppercase text-slate-600">{l.action}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-500 max-w-[200px] truncate">{l.path}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(l.status_code)}`}>
                        {l.status_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{l.ip_address || "—"}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400">Tidak ada log</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400">Halaman {page} dari {lastPage}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => loadLogs(page - 1, module)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                ← Prev
              </button>
              <button disabled={page >= lastPage} onClick={() => loadLogs(page + 1, module)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
