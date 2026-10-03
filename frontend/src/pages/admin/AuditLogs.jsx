import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

function statusColor(code) {
  if (code >= 500) return "text-red-700 bg-red-50 border-red-200";
  if (code >= 400) return "text-amber-700 bg-amber-50 border-amber-200";
  if (code >= 200 && code < 300) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  return "text-slate-600 bg-slate-50 border-slate-200";
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [moduleFilter, setModuleFilter] = useState("");
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

  useEffect(() => {
    loadLogs(1, "");
  }, []);

  function handleFilter(e) {
    e.preventDefault();
    loadLogs(1, moduleFilter);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Immutable tracking of user activities, ticket modifications, and API interactions.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full self-start sm:self-auto">
          {total} Total Audit Records
        </span>
      </div>

      <Card padding="p-4">
        <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <input
              placeholder="Filter by module (e.g. tickets, auth, ai)..."
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder-slate-400"
            />
          </div>
          <Button type="submit" size="sm">
            Filter
          </Button>
          {moduleFilter && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => { setModuleFilter(""); loadLogs(1, ""); }}
            >
              Reset
            </Button>
          )}
        </form>
      </Card>

      <Card padding="p-0" className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton lines={5} />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No audit entries"
            description="No system operations matching the selected filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">User</th>
                  <th className="px-4 py-3.5">Module</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">IP Address</th>
                  <th className="px-4 py-3.5 text-right">HTTP Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                      {l.created_at ? new Date(l.created_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-900">{l.user_name || "System"}</p>
                      <p className="text-[11px] text-slate-400">{l.user_email || "system@local"}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-[10px]">
                        {l.module || "core"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-700 font-medium truncate max-w-xs">
                      {l.action}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      {l.ip_address || "127.0.0.1"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${statusColor(l.status_code || 200)}`}>
                        {l.status_code || 200}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lastPage > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs bg-slate-50/50">
            <span className="text-slate-500">
              Page {page} of {lastPage}
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => loadLogs(page - 1, moduleFilter)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= lastPage}
                onClick={() => loadLogs(page + 1, moduleFilter)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
