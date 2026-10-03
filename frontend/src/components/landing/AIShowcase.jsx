import { useState } from "react";

export default function AIShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    {
      title: "RAG",
      desc: "Retrieves relevant knowledge from your organization's documentation.",
      tag: "Knowledge Retrieval",
    },
    {
      title: "AI Suggestions",
      desc: "Generate context-aware responses for support agents.",
      tag: "Agent Copilot",
    },
    {
      title: "Function Calling",
      desc: "Allow AI to interact with authorized system functions.",
      tag: "Live Execution",
    },
    {
      title: "Context Awareness",
      desc: "Use ticket and conversation context to provide more relevant assistance.",
      tag: "Deep Context",
    },
  ];

  return (
    <section id="ai" className="py-20 lg:py-28 bg-white border-t border-slate-200/80 scroll-mt-12">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
            Augmented Intelligence
          </div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            AI that helps your team,
            <br className="hidden sm:inline" /> not replaces it.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            HelpDesk AI gives support agents the context and tools they need to make better responses, faster.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">
                Empower agents with real-time semantic intelligence
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rather than putting customers in front of hallucinating bots, HelpDesk AI equips your frontline team with instant document citations, accurate drafts, and automated ticket lookup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {capabilities.map((cap, idx) => (
                <div
                  key={cap.title}
                  onClick={() => setActiveTab(idx)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    activeTab === idx
                      ? "bg-blue-50/50 border-blue-400 ring-1 ring-blue-400/20 shadow-xs"
                      : "bg-white border-slate-200/90 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">
                      {cap.title}
                    </span>
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {cap.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50 overflow-hidden">
              <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">AI Assistant Copilot</div>
                    <div className="text-[10px] text-slate-400">Context: Ticket #HD-1024</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-slate-500">Active</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 text-[11px]">
                    C
                  </div>
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-sm p-3 max-w-sm shadow-xs">
                    <div className="font-semibold text-slate-800 text-[11px] mb-0.5">Customer</div>
                    <p className="text-slate-700">I can't access my account.</p>
                  </div>
                </div>

                <div className="pl-9 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/70 rounded-xl text-blue-700 font-medium text-[11px]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>I found 3 relevant knowledge articles.</span>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-xl p-3.5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <span className="text-blue-600">✦</span> Suggested response:
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[10px]">
                        98% Match
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed italic bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                      "Please try resetting your password using the Forgot Password link sent to your registered email address. If you do not receive the link within 5 minutes, please verify your spam folder."
                    </p>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Source: <span className="font-semibold text-slate-600 underline">kb-auth-recovery.md</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                        >
                          Use Response
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
                <span className="italic">Type a reply or press Tab to accept suggestion...</span>
                <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">
                  ⌘K Copilot
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
