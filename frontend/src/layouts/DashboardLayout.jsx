import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-screen">
      <aside className="w-56 bg-slate-900 text-white p-4">
        <div className="text-lg font-bold mb-6">HelpDesk AI</div>
        <nav className="space-y-2 text-sm">
          <div>Dashboard</div>
          <div>Tickets</div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-3 bg-white border-b">
          <span className="text-sm text-slate-500">Selamat datang, {user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}