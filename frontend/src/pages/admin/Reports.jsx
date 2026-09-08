import { useEffect, useState } from "react";
import api from "../../services/api";

const STATUS_COLORS = {
  OPEN: "bg-amber-400",
  IN_PROGRESS: "bg-blue-400",
  RESOLVED: "bg-green-400",
  CLOSED: "bg-slate-400",
};
const PRIORITY_COLORS = {
  LOW: "bg-slate-300",
  MEDIUM: "bg-blue-400",
  HIGH: "bg-orange-400",
  URGENT: "bg-red-500",
};

function BarRow({ label, count, total, colorClass }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${colorClass} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Reports() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tickets").then((res) => setTickets(res.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const total = tickets.length;
  const byStatus = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => ({
    label: s === "IN_PROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase(),
    key: s,
    count: tickets.filter((t) => t.status === s).length,
  }));
  const byPriority = ["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => ({
    label: p.charAt(0) + p.slice(1).toLowerCase(),
    key: p,
    count: tickets.filter((t) => t.priority === p).length,
  }));

  const resolvedTickets = tickets.filter((t) => t.resolved_at && t.created_at);
  const avgResolutionHours = resolvedTickets.length > 0
    ? (resolvedTickets.reduce((sum, t) => sum + (new Date(t.resolved_at) - new Date(t.created_at)) / 3600000, 0) / resolvedTickets.length).toFixed(1)
    : "—";

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const resolvedCount = resolvedTickets.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Laporan Tiket</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ringkasan statistik dan performa penanganan tiket</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tiket", value: total, icon: "📋", color: "text-slate-800", bg: "bg-slate-50" },
          { label: "Tiket Terbuka", value: openCount, icon: "⚠️", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Terselesaikan", value: resolvedCount, icon: "✅", color: "text-green-600", bg: "bg-green-50" },
          { label: "Rata-rata Resolusi", value: avgResolutionHours === "—" ? "—" : `${avgResolutionHours}j`, icon: "⏱", color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{c.label}</p>
                <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
              </div>
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center text-lg`}>{c.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Tiket per Status</h2>
          <p className="text-xs text-slate-400 mb-5">Distribusi berdasarkan status saat ini</p>
          <div className="space-y-4">
            {byStatus.map(({ label, key, count }) => (
              <BarRow key={key} label={label} count={count} total={total} colorClass={STATUS_COLORS[key]} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Tiket per Prioritas</h2>
          <p className="text-xs text-slate-400 mb-5">Distribusi berdasarkan tingkat prioritas</p>
          <div className="space-y-4">
            {byPriority.map(({ label, key, count }) => (
              <BarRow key={key} label={label} count={count} total={total} colorClass={PRIORITY_COLORS[key]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
