import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

function StatCard({ label, value, sub, icon, color, border }) {
  return (
    <div className={`bg-white rounded-xl border ${border || "border-slate-200"} p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color || "text-slate-800"}`}>{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${color ? "" : "bg-slate-100"}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

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
          in_progress: list.filter((x) => x.status === "IN_PROGRESS").length,
          resolved: list.filter((x) => x.status === "RESOLVED").length,
          closed: list.filter((x) => x.status === "CLOSED").length,
          users: (u.data.data || []).length,
          customers: (c.data.data || []).length,
          agents: (a.data.data || []).length,
        });
      })
      .finally(() => setLoading(false));
  }, [user]);

  const isAdmin = user?.role === "admin";
  const recentTickets = tickets.slice(0, 5);

  const STATUS_STYLE = {
    OPEN: "bg-amber-100 text-amber-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-slate-100 text-slate-500",
  };
  const PRIORITY_STYLE = {
    LOW: "bg-slate-100 text-slate-500",
    MEDIUM: "bg-blue-100 text-blue-600",
    HIGH: "bg-orange-100 text-orange-600",
    URGENT: "bg-red-100 text-red-600",
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Ringkasan</h1>
          <p className="text-sm text-slate-500 mt-0.5">Pantau performa respon pelanggan, beban agen, dan integrasi tiket AI secara aktual.</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Tiket" value={stats?.total ?? 0} sub="Semua tiket" icon="📋" />
        <StatCard label="Tiket Terbuka" value={stats?.open ?? 0} sub="Perlu respon" icon="⚠️" color="text-amber-600" border="border-amber-200" />
        <StatCard label="Dalam Proses" value={stats?.in_progress ?? 0} sub="Sedang ditangani" icon="🔄" color="text-blue-600" border="border-blue-200" />
        <StatCard label="Diselesaikan" value={stats?.resolved ?? 0} sub="Rata-rata waktu: —" icon="✅" color="text-green-600" border="border-green-200" />
        <StatCard label="Ditutup" value={stats?.closed ?? 0} sub="Total arsip" icon="🔒" />
        {isAdmin && (
          <StatCard label="Total Akun" value={stats?.users ?? 0} sub={`${stats?.customers ?? 0} Pelanggan · ${stats?.agents ?? 0} Agen`} icon="👥" color="text-indigo-600" border="border-indigo-200" />
        )}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tickets table */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Tiket Memerlukan Perhatian</h2>
              <p className="text-xs text-slate-400 mt-0.5">Daftar tiket aktif yang menunggu respon atau tindakan agen</p>
            </div>
            <Link to="/dashboard/tickets" className="text-xs text-indigo-600 hover:underline font-medium">
              Lihat Semua Tiket →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ID & Subjek</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Prioritas</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <Link to={`/dashboard/tickets/${t.id}`} className="font-medium text-slate-800 hover:text-indigo-600 transition-colors block">
                        <span className="text-xs text-slate-400 font-mono">#{t.ticket_number}</span>
                        <p className="text-sm mt-0.5 truncate max-w-xs">{t.subject}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLE[t.priority] || "bg-slate-100 text-slate-500"}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLE[t.status] || ""}`}>
                        {t.status === "IN_PROGRESS" ? "In Progress" : t.status?.charAt(0) + t.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentTickets.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada tiket aktif</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">Menampilkan {recentTickets.length} dari {stats?.total ?? 0} total tiket berjalan</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* AI Performa */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Performa HelpDesk AI</h3>
                <p className="text-xs text-slate-400">Otomasi respon cerdas</p>
              </div>
              <span className="text-[11px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Aktif</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Resolusi Tanpa Intervensi</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-800">1.2 <span className="text-xs font-normal text-slate-400">detik</span></p>
                <p className="text-[11px] text-slate-500 mt-0.5">Waktu Respon AI</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-800">94.8<span className="text-xs font-normal text-slate-400">%</span></p>
                <p className="text-[11px] text-slate-500 mt-0.5">Akurasi Jawaban</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          {isAdmin && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-800 text-sm">Ringkasan Akun</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Pengguna Total", value: stats?.users, icon: "👤" },
                  { label: "Pelanggan", value: stats?.customers, icon: "🧑‍💼" },
                  { label: "Agen Dukungan", value: stats?.agents, icon: "🛠" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 flex items-center gap-1.5">{item.icon} {item.label}</span>
                    <span className="font-semibold text-slate-800 text-sm">{item.value ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
