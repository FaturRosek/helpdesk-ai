import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const isAdmin = user?.role === "admin";

    const requests = [
      api.get("/tickets").catch(() => ({ data: { data: [] } })),
      isAdmin ? api.get("/users").catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
      isAdmin ? api.get("/customers").catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
      isAdmin ? api.get("/agents").catch(() => ({ data: { data: [] } })) : Promise.resolve({ data: { data: [] } }),
    ];

    Promise.all(requests)
      .then(([tickets, users, customers, agents]) => {
        const ticketList = tickets.data.data || [];
        setStats({
          total_tickets: ticketList.length,
          open: ticketList.filter((t) => t.status === "OPEN").length,
          in_progress: ticketList.filter((t) => t.status === "IN_PROGRESS").length,
          resolved: ticketList.filter((t) => t.status === "RESOLVED").length,
          closed: ticketList.filter((t) => t.status === "CLOSED").length,
          total_users: (users.data.data || []).length,
          total_customers: (customers.data.data || []).length,
          total_agents: (agents.data.data || []).length,
        });
      })
      .catch((err) => {
        setError("Gagal memuat data dashboard");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p className="text-slate-500">Memuat dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  const isAdmin = user?.role === "admin";

  const cards = [
    { label: "Total Tiket", value: stats.total_tickets, color: "bg-indigo-600" },
    { label: "Open", value: stats.open, color: "bg-yellow-500" },
    { label: "In Progress", value: stats.in_progress, color: "bg-blue-500" },
    { label: "Resolved", value: stats.resolved, color: "bg-green-500" },
    { label: "Closed", value: stats.closed, color: "bg-slate-500" },
    ...(isAdmin
      ? [
          { label: "Total Users", value: stats.total_users, color: "bg-purple-600" },
          { label: "Customers", value: stats.total_customers, color: "bg-pink-500" },
          { label: "Agents", value: stats.total_agents, color: "bg-teal-500" },
        ]
      : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} text-white rounded-lg p-5 shadow`}>
            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-sm mt-1 opacity-90">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
