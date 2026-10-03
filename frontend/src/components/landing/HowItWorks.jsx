export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      stepTitle: "Step 01",
      name: "Customer asks",
      desc: "Customer submits a question or support request.",
      subtext: "Omni-channel submission with automatic category detection.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      num: "02",
      stepTitle: "Step 02",
      name: "AI understands",
      desc: "AI analyzes the request and identifies relevant information.",
      subtext: "Extracts document chunks via semantic RAG.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      num: "03",
      stepTitle: "Step 03",
      name: "Agent gets assistance",
      desc: "The support agent receives relevant context and suggested responses.",
      subtext: "One-click draft approval and internal notes.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      num: "04",
      stepTitle: "Step 04",
      name: "Issue gets resolved",
      desc: "The agent responds and resolves the customer request.",
      subtext: "Complete audit log recorded & CSAT captured.",
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const pipeline = [
    { label: "Customer", sub: "Asks query" },
    { label: "Ticket", sub: "Auto-triage" },
    { label: "AI Analysis", sub: "RAG lookup" },
    { label: "Knowledge / Tools", sub: "Verified sources" },
    { label: "Agent", sub: "Review & Polish" },
    { label: "Resolution", sub: "Closed & CSAT" },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/70 border-t border-slate-200/80 scroll-mt-12">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
            Lifecycle Workflow
          </div>
          <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-bold text-slate-900 tracking-tight leading-tight">
            From customer question to resolution.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A frictionless pipeline engineered to minimize response time while ensuring complete accuracy and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-mono">
                    {step.stepTitle}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400">
                {step.subtext}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Resolution Data Pipeline
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {pipeline.map((item, idx) => (
              <div key={item.label} className="flex items-center">
                <div className="flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.sub}</span>
                </div>
                {idx < pipeline.length - 1 && (
                  <div className="px-1 text-slate-300">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
