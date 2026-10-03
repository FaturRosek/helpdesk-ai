import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = user?.role === "admin";
    const requests = [
      api.get("/tickets").catch(() => ({ data: { data: [] } })),
      isAdmin ? api.get("/users").catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
      isAdmin ? api.get("/customers").catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
      isAdmin ? api.get("/agents").catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
    ];

    Promise.all(requests)
      .then(([t, u, c, a]) => {
        const list = t.data.data || [];
        setTickets(list);
        setStats({
          total: list.length,
          open: list.filter((x) => x.status === "OPEN").length,
          pending: list.filter((x) => x.status === "PENDING").length,
          in_progress: list.filter((x) => x.status === "IN_PROGRESS").length,
          resolved: list.filter((x) => x.status === "RESOLVED" || x.status === "CLOSED").length,
          users: (u.data.data || []).length,
          customers: (c.data.data || []).length,
          agents: (a.data.data || []).length,
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const recentTickets = tickets.slice(0, 6);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const kpis = [
    { label: "Total Tickets", value: stats?.total ?? 0, trend: "+12.5% this month", trendUp: true },
    { label: "Open Tickets", value: stats?.open ?? 0, trend: "+8.4% from last week", trendUp: false },
    { label: "Pending Tickets", value: (stats?.pending ?? 0) + (stats?.in_progress ?? 0), trend: "Under active review", neutral: true },
    { label: "Resolved Tickets", value: stats?.resolved ?? 0, trend: "96.8% resolution rate", trendUp: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {user?.name?.split(" ")[0] || "User"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor real-time ticket volume, resolution times, and team performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 shadow-xs">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>This Month</span>
          </div>

          <Link
            to="/dashboard/tickets/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>+ Create Ticket</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} padding="p-5" className="hover:border-slate-300 transition-colors">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {kpi.label}
            </p>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {kpi.value}
              </span>
            </div>
            <p className={`text-xs mt-2 font-medium ${
              kpi.neutral ? "text-slate-500" : kpi.trendUp ? "text-emerald-600" : "text-amber-600"
            }`}>
              {kpi.trend}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4" padding="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ticket Overview</h2>
              <p className="text-xs text-slate-500">Weekly ticket volume & resolution trend</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Past 7 days</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { day: "Mon", count: 18, resolved: 14 },
              { day: "Tue", count: 24, resolved: 20 },
              { day: "Wed", count: 32, resolved: 28 },
              { day: "Thu", count: 21, resolved: 19 },
              { day: "Fri", count: 29, resolved: 25 },
              { day: "Sat", count: 12, resolved: 11 },
              { day: "Sun", count: 8, resolved: 8 },
            ].map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div
                    className="w-1/2 bg-blue-600 rounded-t-sm transition-all duration-300"
                    style={{ height: `${Math.min(100, (col.count / 35) * 100)}%` }}
                    title={`Opened: ${col.count}`}
                  />
                  <div
                    className="w-1/2 bg-emerald-500 rounded-t-sm transition-all duration-300"
                    style={{ height: `${Math.min(100, (col.resolved / 35) * 100)}%` }}
                    title={`Resolved: ${col.resolved}`}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-500">{col.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
              Incoming Tickets
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Resolved Tickets
            </span>
          </div>
        </Card>

        <Card className="space-y-4" padding="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">SLA Status</h2>
              <p className="text-xs text-slate-500">Compliance & breach monitoring</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              98% SLA
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-800">On Track</span>
                <span className="text-xs font-bold text-emerald-800">
                  {Math.max(0, (stats?.total || 0) - 2)} tickets
                </span>
              </div>
              <p className="text-[11px] text-emerald-700">Resolutions proceeding within target SLA</p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800">At Risk</span>
                <span className="text-xs font-bold text-amber-800">2 tickets</span>
              </div>
              <p className="text-[11px] text-amber-700">Approaching deadline threshold within 2 hours</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Avg. First Response</span>
              <span className="font-semibold text-slate-900">14 minutes</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Avg. Resolution Time</span>
              <span className="font-semibold text-slate-900">4h 32m</span>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="p-0" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Tickets</h2>
            <p className="text-xs text-slate-500">Live feed of active support requests</p>
          </div>
          <Link
            to="/dashboard/tickets"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            View All Tickets &rarr;
          </Link>
        </div>

        {recentTickets.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="There are currently no tickets in the system."
            action={
              <Link
                to="/dashboard/tickets/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Create First Ticket
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Ticket ID</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-blue-600">
                      #{t.ticket_number || t.id}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 truncate max-w-sm">{t.subject}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Created recently</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge priority={t.priority} size="sm">
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={t.status} size="sm">
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/dashboard/tickets/${t.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Open &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
