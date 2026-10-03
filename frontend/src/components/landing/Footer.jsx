import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="bg-slate-50 border-t border-slate-200/90 text-slate-600">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h15m-15 3.75h15m-9 3.75v1.5m6-1.5v1.5M7.5 7.5h9a3 3 0 013 3v6a3 3 0 01-3 3h-9a3 3 0 01-3-3v-6a3 3 0 013-3z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                HelpDesk <span className="text-blue-600">AI</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              AI-powered customer support platform.
            </p>

            <div className="pt-2 text-xs text-slate-400">
              Modern support workspace with ticket management, RAG knowledge, and automated SLA tracking.
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="#features" className="hover:text-blue-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#ai" className="hover:text-blue-600 transition-colors">
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-blue-600 transition-colors">
                  Knowledge Base
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-blue-600 transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <span className="cursor-default text-slate-500 hover:text-slate-700" title="Portfolio Project Resource">
                  Documentation
                </span>
              </li>
              <li>
                <span className="cursor-default text-slate-500 hover:text-slate-700" title="Portfolio Project Resource">
                  User Guide
                </span>
              </li>
              <li>
                <span className="cursor-default text-slate-500 hover:text-slate-700" title="Portfolio Project Resource">
                  API
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <span className="cursor-default text-slate-500 hover:text-slate-700" title="Portfolio Project Information">
                  About
                </span>
              </li>
              <li>
                <span className="cursor-default text-slate-500 hover:text-slate-700" title="Portfolio Project Information">
                  Contact
                </span>
              </li>
              <li>
                <span className="cursor-default text-slate-500 hover:text-slate-700" title="Portfolio Project Information">
                  Privacy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {currentYear} HelpDesk AI. All rights reserved.
          </div>
          <div className="text-center sm:text-right">
            Designed for Modern Customer Support Teams
          </div>
        </div>
      </div>
    </footer>
  );
}
