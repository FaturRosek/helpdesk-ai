import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function TicketList() {
const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(true);
const { user } = useAuth();

useEffect(() => {
api.get("/tickets")
.then((res) => setTickets(res.data.data))
.finally(() => setLoading(false));
}, []);

if (loading) return <p>Loading tickets...</p>;

return (
<div>
    <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
            {user.role === "customer" ? "Tiket Saya" : user.role === "agent" ? "Ticket Queue" : "Semua Tiket"}
        </h1>
        {user.role === "customer" && (
        <Link to="/dashboard/tickets/new" className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
        + Buat Tiket
        </Link>
        )}
    </div>
    <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-slate-100 text-left">
            <tr>
                <th className="p-3">Nomor</th>
                <th className="p-3">Subjek</th>
                <th className="p-3">Prioritas</th>
                <th className="p-3">Status</th>
            </tr>
        </thead>
        <tbody>
            {tickets.map((t) => (
            <tr key={t.id} className="border-t hover:bg-slate-50">
                <td className="p-3">
                    <Link to={`/dashboard/tickets/${t.id}`} className="text-indigo-600">
                    {t.ticket_number}
                    </Link>
                </td>
                <td className="p-3">{t.subject}</td>
                <td className="p-3">{t.priority}</td>
                <td className="p-3">{t.status}</td>
            </tr>
            ))}
        </tbody>
    </table>

    {tickets.length === 0 && <p className="text-slate-400 mt-4">Belum ada tiket.</p>}
</div>
);
}
