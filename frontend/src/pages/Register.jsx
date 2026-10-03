import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h15m-15 3.75h15m-9 3.75v1.5m6-1.5v1.5M7.5 7.5h9a3 3 0 013 3v6a3 3 0 01-3 3h-9a3 3 0 01-3-3v-6a3 3 0 013-3z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              HelpDesk <span className="text-blue-200">AI</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white">
            <span>✦</span> Fast Onboarding
          </div>

          <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Start Resolving
            <br />
            Support in Minutes.
          </h2>

          <p className="text-sm text-blue-100 leading-relaxed">
            Create an account to submit support requests, track SLA progress in real-time, and get AI-assisted guidance instantly.
          </p>

          <div className="pt-2 space-y-2 text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span> No credit card required
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span> Integrated knowledge access
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">✓</span> Transparent SLA resolution times
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-blue-200/80">
          &copy; 2026 HelpDesk AI. Enterprise Support Workspace.
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h15m-15 3.75h15m-9 3.75v1.5m6-1.5v1.5M7.5 7.5h9a3 3 0 013 3v6a3 3 0 01-3 3h-9a3 3 0 01-3-3v-6a3 3 0 013-3z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">
                HelpDesk <span className="text-blue-600">AI</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Sign up to submit and track support requests.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Fatur Rosek"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="name@company.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              required
              value={form.password_confirmation}
              onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            />

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
