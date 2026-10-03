import { useState } from "react";

export default function SolutionSection() {
  const [activeItem, setActiveItem] = useState(0);

  const pillars = [
    {
      title: "Ticket Management",
      desc: "Centralized triage, priority matrix, and automated assignment.",
      tag: "Operations",
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      title: "Knowledge Base",
      desc: "Structured organizational SOPs, manual chunks, and verified docs.",
      tag: "Information",
      color: "purple",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: "AI Assistant",
      desc: "Context-aware response suggestions & semantic search.",
      tag: "Intelligence",
      color: "indigo",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Automation",
      desc: "Proactive SLA deadline monitoring, escalations, and alerts.",
      tag: "Speed",
      color: "emerald",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70 border-y border-slate-200/80">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
            Unified Support Infrastructure
          </div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            Everything your support team needs,
            <br className="hidden sm:inline" /> in one intelligent workspace.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            HelpDesk AI combines ticket management, knowledge, and AI assistance into one centralized platform.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Integrated System Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {pillars.map((item, idx) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveItem(idx)}
                className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  activeItem === idx
                    ? "bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20"
                    : "bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${activeItem === idx ? "bg-blue-600 text-white" : "bg-white text-slate-700 border border-slate-200/70"}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center my-2">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                Converges Into
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-blue-600/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold text-blue-50">
                  <span>●</span> Single Unified Workspace
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  HelpDesk AI Platform
                </h3>
                <p className="text-sm text-blue-100 max-w-xl">
                  Eliminates context switching between fragmented spreadsheets, email threads, and search docs. Agents and managers act with complete clarity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/15">
                  <div className="text-lg font-extrabold text-white">0s</div>
                  <div className="text-[11px] text-blue-100">Manual Routing</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/15">
                  <div className="text-lg font-extrabold text-white">100%</div>
                  <div className="text-[11px] text-blue-100">Audit Trail</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
