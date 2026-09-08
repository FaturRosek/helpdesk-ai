import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [module, setModule] = useState("");
  const [loading, setLoading] = useState(true);

  function loadLogs(p = 1, mod = "") {
    setLoading(true);
    api
      .get("/audit-logs", { params: { page: p, per_page: 30, module: mod || undefined } })
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

  const statusColor = (code) => {
    if (code >= 500) return "text-red-600 font-semibold";
    if (code >= 400) return "text-orange-500 font-semibold";
    if (code >= 200 && code < 300) return "text-green-600 font-semibold";
    return "text-slate-600";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      <p className="text-slate-500 text-sm mb-4">Total: {total} entri</p>

      {/* Filter */}
      <form onSubmit={handleFilter} className="flex gap-2 mb-4">
        <input
          placeholder="Filter modul (contoh: tickets)"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-60"
        />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">Filter</button>
        <button
          type="button"
          onClick={() => { setModule(""); loadLogs(1, ""); }}
          className="bg-slate-200 text-slate-700 px-4 py-2 rounded text-sm"
        >
          Reset
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Memuat log...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded shadow text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Modul</th>
                  <th className="p-3">Aksi</th>
                  <th className="p-3">Path</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 text-xs text-slate-500 whitespace-nowrap">
                      {l.created_at ? new Date(l.created_at).toLocaleString("id-ID") : "-"}
                    </td>
                    <td className="p-3">
                      {l.user_name ? (
                        <span>{l.user_name}<br /><span className="text-xs text-slate-400">{l.user_email}</span></span>
                      ) : (
                        <span className="text-slate-400 text-xs">Guest</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                        {l.module || "-"}
                      </span>
                    </td>
                    <td className="p-3 uppercase text-xs font-mono">{l.action}</td>
                    <td className="p-3 text-xs font-mono text-slate-600 max-w-xs truncate">{l.path}</td>
                    <td className={`p-3 text-xs ${statusColor(l.status_code)}`}>{l.status_code}</td>
                    <td className="p-3 text-xs text-slate-400">{l.ip_address || "-"}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-400">
                      Tidak ada log
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex gap-2 mt-4 justify-end">
              <button
                disabled={page <= 1}
                onClick={() => loadLogs(page - 1, module)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-3 py-1 text-sm text-slate-600">
                {page} / {lastPage}
              </span>
              <button
                disabled={page >= lastPage}
                onClick={() => loadLogs(page + 1, module)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
