import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function navClass(path) {
    const active = location.pathname === path || location.pathname.startsWith(path + "/");
    return `block px-3 py-2 rounded text-sm transition-colors ${
      active
        ? "bg-indigo-700 text-white"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">
          HelpDesk AI
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
          <Link to="/dashboard" className={navClass("/dashboard")}>
            📊 Dashboard
          </Link>
          <Link to="/dashboard/tickets" className={navClass("/dashboard/tickets")}>
            🎫 Tickets
          </Link>

          {user?.role === "admin" && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs text-slate-400 uppercase tracking-wider">
                Admin
              </div>
              <Link to="/dashboard/users" className={navClass("/dashboard/users")}>
                👤 Users
              </Link>
              <Link to="/dashboard/customers" className={navClass("/dashboard/customers")}>
                🧑‍💼 Customers
              </Link>
              <Link to="/dashboard/agents" className={navClass("/dashboard/agents")}>
                🛠 Agents
              </Link>
              <Link to="/dashboard/categories" className={navClass("/dashboard/categories")}>
                🗂 Categories
              </Link>
              <Link to="/dashboard/admin-tickets" className={navClass("/dashboard/admin-tickets")}>
                📋 Kelola Tiket
              </Link>

              <div className="pt-4 pb-1 px-3 text-xs text-slate-400 uppercase tracking-wider">
                Laporan
              </div>
              <Link to="/dashboard/reports" className={navClass("/dashboard/reports")}>
                📈 Reports
              </Link>
              <Link to="/dashboard/audit-logs" className={navClass("/dashboard/audit-logs")}>
                🔍 Audit Logs
              </Link>
            </>
          )}
        </nav>

        {/* User info at bottom */}
        <div className="px-4 py-3 border-t border-slate-700 text-xs text-slate-400">
          <p className="truncate font-medium text-slate-200">{user?.name}</p>
          <p className="truncate">{user?.email}</p>
          <p className="capitalize mt-0.5 text-indigo-400">{user?.role}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center px-6 py-3 bg-white border-b shadow-sm shrink-0">
          <span className="text-sm text-slate-500">
            Selamat datang, <span className="font-medium text-slate-700">{user?.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}