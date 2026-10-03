import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ subject: "", description: "", priority: "MEDIUM" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user?.role !== "customer" && user?.role !== "admin") {
    return (
      <div className="max-w-lg">
        <Card padding="p-6" className="text-center bg-amber-50/50 border-amber-200">
          <p className="font-bold text-amber-800 text-lg mb-2">Access Notice</p>
          <p className="text-amber-700 text-xs mb-4">
            Only customers and administrators can create new support tickets.
          </p>
          <Link to="/dashboard/tickets" className="text-blue-600 text-xs font-semibold hover:underline">
            &larr; Back to Tickets
          </Link>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/tickets", form);
      navigate("/dashboard/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  }

  const PRIORITIES = [
    { value: "LOW", label: "Low", desc: "Non-urgent query" },
    { value: "MEDIUM", label: "Medium", desc: "Standard SLA (24h)" },
    { value: "HIGH", label: "High", desc: "Business impacting (8h)" },
    { value: "URGENT", label: "Urgent", desc: "Critical outage (2h)" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Support Ticket</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Describe the issue in detail to receive fast, AI-assisted resolution.
        </p>
      </div>

      <Card padding="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Subject"
            placeholder="Brief summary of the issue..."
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Provide context, error messages, and reproduction steps..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none h-32 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Priority Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRIORITIES.map((p) => (
                <label
                  key={p.value}
                  className={`cursor-pointer rounded-lg p-3 border transition-all ${
                    form.priority === p.value
                      ? "border-blue-600 bg-blue-50/60 ring-1 ring-blue-600/20 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={form.priority === p.value}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="sr-only"
                  />
                  <p className="font-bold text-xs text-slate-900">{p.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </Button>
            <Link to="/dashboard/tickets">
              <Button variant="secondary">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
