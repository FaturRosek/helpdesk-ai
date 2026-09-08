import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

const NAV_ITEMS = {
  main: [
    { to: "/dashboard", label: "Dashboard", exact: true, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/dashboard/tickets", label: "Tiket", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", badge: null },
    { to: "/dashboard/knowledge", label: "Knowledge Base", exact: true, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.75 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
    { to: "/dashboard/ai-chat", label: "AI Assistant", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", beta: true },
  ],
  management: [
    { to: "/dashboard/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { to: "/dashboard/customers", label: "Pelanggan", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { to: "/dashboard/agents", label: "Agen Dukungan", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" },
    { to: "/dashboard/categories", label: "Kategori", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { to: "/dashboard/admin-tickets", label: "Kelola Tiket", icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" },
    { to: "/dashboard/admin/knowledge", label: "Knowledge CRUD", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  ],
  reports: [
    { to: "/dashboard/reports", label: "Laporan Tiket", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { to: "/dashboard/audit-logs", label: "Analitik SLA", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  ],
  agent: [
    { to: "/dashboard/agent/knowledge", label: "Tulis Artikel", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" },
  ],
};

function NavIcon({ d }) {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(to, exact = false) {
    return exact
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(to + "/");
  }

  function NavLink({ item }) {
    const active = isActive(item.to, item.exact);
    return (
      <Link
        to={item.to}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          active
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <NavIcon d={item.icon} />
        <span className="flex-1">{item.label}</span>
        {item.beta && (
          <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded-full font-semibold leading-none">BETA</span>
        )}
        {item.badge && (
          <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold leading-none">{item.badge}</span>
        )}
      </Link>
    );
  }

  const role = user?.role;
  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  const roleLabel = role === "admin" ? "Super Admin" : role === "agent" ? "Agen" : "Pelanggan";
  const roleBg = role === "admin" ? "bg-amber-500" : role === "agent" ? "bg-blue-500" : "bg-green-500";

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 flex flex-col shrink-0 overflow-hidden">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-none">HelpDesk AI</p>
              <p className="text-slate-400 text-[10px] mt-0.5">Pusat Layanan Cerdas</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">Menu Utama</p>
          {NAV_ITEMS.main.map((item) => <NavLink key={item.to} item={item} />)}

          {role === "agent" && (
            <>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 pt-4 mb-2">Konten</p>
              {NAV_ITEMS.agent.map((item) => <NavLink key={item.to} item={item} />)}
            </>
          )}

          {role === "admin" && (
            <>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 pt-4 mb-2">Manajemen</p>
              {NAV_ITEMS.management.map((item) => <NavLink key={item.to} item={item} />)}

              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 pt-4 mb-2">Laporan & SLA</p>
              {NAV_ITEMS.reports.map((item) => <NavLink key={item.to} item={item} />)}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full ${roleBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
              <p className="text-slate-400 text-[10px] truncate">{user?.email}</p>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded text-white font-medium shrink-0 ${roleBg}`}>{roleLabel}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0 shadow-sm">
          <div className="flex-1">
            <span className="text-sm text-slate-500">
              Selamat datang kembali,{" "}
              <span className="font-semibold text-slate-800">{user?.name}</span>
            </span>
            <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full text-white font-medium ${roleBg}`}>
              {roleLabel}
            </span>
          </div>

          {/* Search */}
          <div className="relative hidden md:block">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Cari tiket, artikel, pengguna..."
              className="pl-9 pr-4 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64"
              readOnly
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 border border-slate-200 rounded px-1">⌘K</span>
          </div>

          {/* Notif */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* New ticket CTA — only for customer */}
          {role === "customer" && (
            <Link
              to="/dashboard/tickets/new"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Buat Tiket
            </Link>
          )}

          {role === "admin" && (
            <Link
              to="/dashboard/tickets/new"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Buat Tiket
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
