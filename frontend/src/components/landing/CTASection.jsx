import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function CTASection() {
  const { user } = useAuth();

  return (
    <section id="pricing" className="py-20 lg:py-24 bg-white scroll-mt-12">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-14 lg:p-16 text-center text-white shadow-xl shadow-blue-600/20 overflow-hidden">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white/95">
              <span>✦</span> Start Transforming Your Support Today
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight">
              Ready to make support smarter?
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed">
              Give your support team the tools they need to resolve customer issues faster.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-blue-700 hover:bg-slate-50 font-bold rounded-xl text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 text-center"
                aria-label="Get started with HelpDesk AI"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-500/20 hover:bg-blue-500/30 text-white font-semibold rounded-xl text-sm border border-white/25 transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Explore the Platform
              </a>
            </div>

            <div className="pt-2 text-xs text-blue-200/80">
              No credit card required &bull; Immediate setup &bull; Fully integrated knowledge
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
