import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Reports() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets")
      .then((res) => setTickets(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400">Memuat laporan...</p>;

  const total = tickets.length;
  const byStatus = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => ({
    label: s,
    count: tickets.filter((t) => t.status === s).length,
  }));
  const byPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => ({
    label: p,
    count: tickets.filter((t) => t.priority === p).length,
  }));

  const resolvedTickets = tickets.filter((t) => t.resolved_at && t.created_at);
  const avgResolutionHours =
    resolvedTickets.length > 0
      ? (
          resolvedTickets.reduce((sum, t) => {
            const diff =
              (new Date(t.resolved_at) - new Date(t.created_at)) / 1000 / 3600;
            return sum + diff;
          }, 0) / resolvedTickets.length
        ).toFixed(1)
      : "N/A";

  const STATUS_COLORS = {
    OPEN: "bg-yellow-400",
    IN_PROGRESS: "bg-blue-400",
    RESOLVED: "bg-green-400",
    CLOSED: "bg-slate-400",
  };
  const PRIORITY_COLORS = {
    LOW: "bg-gray-300",
    MEDIUM: "bg-blue-300",
    HIGH: "bg-orange-400",
    URGENT: "bg-red-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-600 text-white rounded-lg p-5 shadow">
          <p className="text-3xl font-bold">{total}</p>
          <p className="text-sm mt-1 opacity-90">Total Tiket</p>
        </div>
        <div className="bg-green-500 text-white rounded-lg p-5 shadow">
          <p className="text-3xl font-bold">{resolvedTickets.length}</p>
          <p className="text-sm mt-1 opacity-90">Terselesaikan</p>
        </div>
        <div className="bg-purple-600 text-white rounded-lg p-5 shadow">
          <p className="text-3xl font-bold">{avgResolutionHours}</p>
          <p className="text-sm mt-1 opacity-90">Rata-rata Resolusi (jam)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Tiket per Status</h2>
          <div className="space-y-3">
            {byStatus.map(({ label, count }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${STATUS_COLORS[label]} h-2 rounded-full transition-all`}
                    style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Tiket per Prioritas</h2>
          <div className="space-y-3">
            {byPriority.map(({ label, count }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="font-semibold">{count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${PRIORITY_COLORS[label]} h-2 rounded-full transition-all`}
                    style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
