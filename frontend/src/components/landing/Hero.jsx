import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-white">
      <div
        className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/70 via-slate-50/30 to-transparent -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              AI-Powered Customer Support
            </div>

            <h1 className="text-[38px] sm:text-[46px] lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Smarter Support.
              <br />
              <span className="text-blue-600">Faster Resolution.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Help your support team resolve customer issues faster with AI-powered assistance, intelligent ticket management, and a centralized knowledge base.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 text-center"
                aria-label="Get started with HelpDesk AI"
              >
                {user ? "Go to Dashboard" : "Get Started"}
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 font-semibold rounded-xl text-sm transition-all duration-200 shadow-xs text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Explore Features
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Contextual AI Suggestions
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Built-in Knowledge RAG
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant SLA Tracking
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="w-3 h-3 rounded-full bg-slate-300" />
                    <span className="ml-2 text-xs font-semibold text-slate-700">HelpDesk AI Workspace</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Live System
                  </span>
                </div>

                <div className="grid grid-cols-12 min-h-[360px]">
                  <div className="hidden sm:block sm:col-span-4 bg-slate-50/70 border-r border-slate-200 p-3.5 space-y-1.5 text-xs">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Menu
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-default">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-blue-50 text-blue-700 font-semibold rounded-lg border border-blue-100/70">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span>Tickets</span>
                      </div>
                      <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">4</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-default">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Customers</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-default">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span>Knowledge</span>
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg cursor-default">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium text-slate-700">AI Assistant</span>
                    </div>
                  </div>

                  <div className="col-span-12 sm:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-white">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600">Ticket #HD-1024</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            High Priority
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">2m ago</span>
                      </div>

                      <div className="pt-3">
                        <h2 className="text-sm font-bold text-slate-900">
                          Customer can't login
                        </h2>
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800">Sarah (Customer): </span>
                          "I've been unable to sign into my dashboard since this morning. It says invalid credentials after the update."
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-blue-200/90 bg-blue-50/50 p-3.5 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                          <svg className="w-4 h-4 text-blue-600 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          AI Suggested Response
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100/80 text-blue-800 rounded-md">
                          98% Confidence
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed italic bg-white/80 p-2.5 rounded-lg border border-blue-100">
                        "Hi Sarah, try resetting your password using the secure Forgot Password link sent to your registered email. We also verified your session state in the auth database."
                      </p>

                      <div className="pt-1 flex items-center justify-end gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 cursor-pointer">
                          Edit
                        </span>
                        <span className="text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg cursor-pointer shadow-xs">
                          Send Response
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
