import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const workflowSteps = [
    {
      step: "01",
      title: "Input Tiket & AI Chat 24/7",
      desc: "Pelanggan dapat berkonsultasi langsung melalui asisten percakapan cerdas atau membuat tiket keluhan dengan prioritas yang disesuaikan.",
      badge: "Customer Touchpoint",
      color: "from-blue-600 to-indigo-600",
      stats: "24/7 Real-Time Response",
    },
    {
      step: "02",
      title: "RAG & Pengetahuan Kontekstual",
      desc: "Sistem secara otomatis mengekstraksi dan mencocokkan potongan dokumen (chunks), SOP, serta knowledge base untuk menemukan solusi relevan sebelum eskalasi.",
      badge: "Knowledge Engine",
      color: "from-indigo-600 to-purple-600",
      stats: "Ekstraksi Chunk Semantik",
    },
    {
      step: "03",
      title: "Kalkulasi SLA & Auto-Assignment",
      desc: "Mesin otomasi menghitung tenggat waktu SLA (Urgent 2 jam, High 8 jam, Medium 24 jam) dan langsung menugaskan tiket ke agen dengan beban kerja terendah.",
      badge: "SLA Automation",
      color: "from-purple-600 to-pink-600",
      stats: "Distribusi Beban Seimbang",
    },
    {
      step: "04",
      title: "Ruang Kerja Agen & AI Copilot",
      desc: "Agen menerima tiket lengkap dengan ringkasan otomatis, catatan internal rahasia, rekomendasi tindakan, dan alur perpesanan multi-arah.",
      badge: "Agent Workspace",
      color: "from-pink-600 to-amber-600",
      stats: "Ringkasan Tiket Seketika",
    },
    {
      step: "05",
      title: "Resolusi, CSAT & Analitik Eksekutif",
      desc: "Tiket diselesaikan dengan pencatatan audit log lengkap, pembaruan skor CSAT pelanggan, dan pelaporan performa SLA waktu-nyata bagi manajer.",
      badge: "Reporting & Audit",
      color: "from-emerald-600 to-teal-600",
      stats: "98%+ Kepatuhan SLA",
    },
  ];

  const roles = [
    {
      name: "Pelanggan (Customer)",
      roleTag: "Customer Portal",
      desc: "Dapatkan solusi instan lewat AI chat, buat tiket mudah, dan lacak status keluhan secara transparan.",
      features: [
        "Percakapan interaktif dengan AI Assistant",
        "Pembuatan tiket dengan penentuan prioritas otomatis",
        "Pelacakan riwayat dan notifikasi status real-time",
        "Akses artikel solusi dan panduan mandiri",
      ],
      icon: "👥",
      gradient: "from-blue-500/10 to-indigo-500/10",
      border: "border-blue-200",
    },
    {
      name: "Agen Dukungan (Agent)",
      roleTag: "Agent Workspace",
      desc: "Tingkatkan produktivitas kerja dengan antrean tiket terpusat, AI summary, dan catatan internal.",
      features: [
        "Antrean tiket terorganisir sesuai urgensi",
        "AI Summarizer untuk memahami esensi keluhan",
        "Catatan internal khusus kolaborasi tim agen",
        "Pembaruan status cepat (In Progress, Resolved)",
      ],
      icon: "🎧",
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-200",
    },
    {
      name: "Administrator (Admin)",
      roleTag: "System Control",
      desc: "Kelola operasional helpdesk, pengguna, hak akses peran, kategori, dan pustaka dokumen RAG.",
      features: [
        "Manajemen pengguna, agen, dan pelanggan",
        "Upload dan pengelolaan berkas dokumen RAG",
        "Konfigurasi kategori layanan & automasi",
        "Inspeksi log audit aktivitas sistem menyeluruh",
      ],
      icon: "⚙️",
      gradient: "from-amber-500/10 to-orange-500/10",
      border: "border-amber-200",
    },
    {
      name: "Manajer Dukungan (Manager)",
      roleTag: "Analytics & KPI",
      desc: "Pantau kepatuhan SLA, waktu penyelesaian masalah, serta performa seluruh agen secara holistik.",
      features: [
        "Dashboard analitik metrik kepatuhan SLA",
        "Statistik waktu penyelesaian (Resolution Time)",
        "Evaluasi kinerja dan beban kerja agen dukungan",
        "Pemantauan skor kepuasan pelanggan (CSAT)",
      ],
      icon: "📊",
      gradient: "from-emerald-500/10 to-teal-500/10",
      border: "border-emerald-200",
    },
  ];

  const faqs = [
    {
      q: "Bagaimana cara kerja AI Assistant dan RAG di HelpDesk AI?",
      a: "AI Assistant memanfaatkan Large Language Model yang terhubung dengan basis pengetahuan dokumen perusahaan Anda melalui Retrieval-Augmented Generation (RAG). Setiap pertanyaan dicocokkan dengan dokumen SOP yang relevan untuk memberikan jawaban akurat dengan referensi sumber.",
    },
    {
      q: "Bagaimana sistem menghitung dan memantau SLA?",
      a: "Setiap tiket otomatis dihitung batas waktunya berdasarkan tingkat prioritas (Urgent: 2 jam, High: 8 jam, Medium: 24 jam, Low: 48 jam). Sistem terus memantau tiket aktif, memicu eskalasi prioritas jika mendekati batas, dan mengirimkan notifikasi instan kepada tim.",
    },
    {
      q: "Apakah agen bisa menambahkan catatan yang tidak bisa dilihat pelanggan?",
      a: "Ya, sistem memiliki fitur Internal Notes khusus agen dan admin. Catatan tersebut hanya dapat dibaca oleh staf internal untuk koordinasi teknis.",
    },
    {
      q: "Format dokumen apa saja yang didukung untuk diindeks RAG?",
      a: "Sistem mendukung berkas teks seperti TXT, Markdown, CSV, DOCX, dan berkas panduan PDF yang diekstrak menjadi potongan teks semantik (chunks).",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white font-sans">
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">
                HelpDesk AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                v2.0 Enterprise
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#workflow" className="hover:text-white transition-colors">Alur Sistem</a>
            <a href="#roles" className="hover:text-white transition-colors">Peran Pengguna</a>
            <a href="#features" className="hover:text-white transition-colors">Fitur Unggulan</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>Buka Dashboard</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none -translate-x-32 translate-y-24"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-indigo-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Platform Dukungan Pelanggan Cerdas Terintegrasi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Solusi Tiket Lebih Cepat, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400">
                Agen Lebih Efektif dengan AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              HelpDesk AI menggabungkan percakapan cerdas LLM, pencarian dokumen RAG (Retrieval-Augmented Generation), otomasi SLA, dan alur kerja agen terpadu dalam satu sistem yang tangguh.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-xl shadow-indigo-600/40 transition-all transform hover:-translate-y-0.5"
              >
                {user ? "Masuk ke Dashboard Saya" : "Mulai Registrasi Gratis"}
              </Link>
              <a
                href="#workflow"
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-all"
              >
                Pelajari Alur Kerja Sistem &darr;
              </a>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> RAG Document Retrieval
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Otomasi SLA & Escalation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Auto Assignment Tiket
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> 4 Tingkat Akses RBAC
              </span>
            </div>
          </div>

          <div className="mt-16 max-w-5xl mx-auto bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-300">helpdesk-ai // intelligent-flow-monitor</span>
              </div>
              <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                Sistem Operasional Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold uppercase text-slate-400">Pelanggan Mengirim Pertanyaan</p>
                <p className="text-sm font-medium text-slate-200 mt-2 italic">
                  "Bagaimana cara mereset password akun email korporat kami?"
                </p>
                <div className="mt-3 text-[10px] bg-indigo-950/60 text-indigo-300 p-2 rounded-lg border border-indigo-900/50">
                  ⚡ AI Assistant menganalisis intent & kategori: Keamanan Akun
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold uppercase text-slate-400">RAG Context & Chunk Matching</p>
                <p className="text-xs text-slate-300 mt-2">
                  Ditemukan relevansi di <span className="text-indigo-400 font-medium">SOP-Keamanan-2026.pdf</span> (Bagian #3)
                </p>
                <div className="mt-3 text-[10px] bg-purple-950/60 text-purple-300 p-2 rounded-lg border border-purple-900/50">
                  🎯 Skor Relevansi 98% &bull; Menyiapkan solusi terverifikasi
                </div>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[11px] font-semibold uppercase text-slate-400">SLA Engine & Penugasan</p>
                <p className="text-xs text-slate-300 mt-2">
                  Prioritas ditentukan: <span className="text-amber-400 font-semibold">MEDIUM (24 Jam SLA)</span>
                </p>
                <div className="mt-3 text-[10px] bg-emerald-950/60 text-emerald-300 p-2 rounded-lg border border-emerald-900/50">
                  ✅ Ditugaskan otomatis ke Agen tersedia dengan notifikasi instan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-20 bg-slate-950/80 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Alur Kerja Proyek HelpDesk AI
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Setiap keluhan pelanggan melalui tahapan cerdas yang mengoptimalkan kolaborasi AI dan manusia demi kepuasan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {workflowSteps.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveWorkflow(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                  activeWorkflow === idx
                    ? "bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${item.color} text-white`}>
                    Tahap {item.step}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.badge}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-indigo-400 font-semibold">{item.stats}</span>
                  <span className="text-slate-500">&rarr;</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-semibold text-indigo-400">Fokus Tahap Terpilih</span>
              <h4 className="text-xl font-bold text-white">
                Tahap {workflowSteps[activeWorkflow].step}: {workflowSteps[activeWorkflow].title}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {workflowSteps[activeWorkflow].desc}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/dashboard/ai-chat"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
              >
                Coba Fitur AI Chat
              </Link>
              <Link
                to="/dashboard/tickets/new"
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                Buat Tiket Uji Coba
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Akses Berbasis Peran (RBAC)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Dibuat untuk 4 Peran Pengguna Utama
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Setiap pengguna mendapatkan ruang kerja yang disesuaikan secara presisi dengan tanggung jawab masing-masing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, idx) => (
              <div
                key={idx}
                className="bg-slate-850 bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{r.icon}</span>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
                      {r.roleTag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{r.name}</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{r.desc}</p>
                  </div>
                  <div className="pt-2 space-y-2">
                    {r.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-indigo-400 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <Link
                    to="/login"
                    className="w-full block text-center py-2 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Masuk sebagai {r.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Teknologi Mutakhir
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Fitur Lengkap Sesuai Dokumen PRD
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Arsitektur terintegrasi mulai dari autentikasi JWT hingga visualisasi analitik performa eksekutif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-bold">
                📚
              </div>
              <h3 className="text-base font-bold text-white">Manajemen Dokumen & RAG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unggah panduan SOP, buku manual teknis, dan dokumen kebijakan. Sistem otomatis memecah berkas menjadi chunk teks untuk menjawab kueri pelanggan dengan sumber otentik.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg font-bold">
                ⚡
              </div>
              <h3 className="text-base font-bold text-white">Mesin Otomasi SLA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pemantauan tenggat resolusi per tingkat prioritas. Mendeteksi indikasi breach secara proaktif, mengeskalasi prioritas tiket, dan mengirim sinyal notifikasi ke admin dan agen.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                🤖
              </div>
              <h3 className="text-base font-bold text-white">AI Agent & Function Calling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asisten AI dapat menjalankan tool internal seperti pembuatan tiket otomatis, pemeriksaan status tiket pelanggan, perangkuman pesan, dan pencarian basis data.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-lg font-bold">
                🔒
              </div>
              <h3 className="text-base font-bold text-white">Catatan Internal Rahasia</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fitur pesan internal memungkinkan agen dan admin saling berdiskusi dalam konteks tiket tanpa terlihat oleh pelanggan, menjamin koordinasi penanganan yang mulus.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                📈
              </div>
              <h3 className="text-base font-bold text-white">Analitik SLA & Kepuasan (CSAT)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualisasi 6 metrik utama fase 17: Statistik Tiket, Resolution Time, SLA Performance, Kinerja Agen, Statistik Kategori, dan Skor Kepuasan Pelanggan.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-bold">
                🔔
              </div>
              <h3 className="text-base font-bold text-white">Pusat Notifikasi Interaktif</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peringatan penugasan tiket baru, notifikasi batas waktu SLA, dan pembaruan respon tiket dikirimkan langsung ke navbar pengguna dengan status baca real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Pertanyaan Umum
            </span>
            <h2 className="text-3xl font-extrabold text-white">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div className="divide-y divide-slate-800 border-y border-slate-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-5 space-y-2">
                <h3 className="text-base font-bold text-slate-200">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-slate-900 to-indigo-950 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Tingkatkan Standar Layanan Pelanggan Sekarang
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ekosistem HelpDesk AI untuk menyelesaikan tiket lebih cepat, menata dokumen pengetahuan, dan memantau kepatuhan SLA secara terukur.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-xl shadow-indigo-600/30 transition-all"
            >
              Daftar Akun Baru
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-all"
            >
              Masuk Portal
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              H
            </div>
            <span className="font-semibold text-slate-400">HelpDesk AI</span>
            <span>&bull;</span>
            <span>Platform Customer Support & SLA Automation</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            Dibuat untuk integrasi layanan pelanggan yang cerdas, efisien, dan transparan.
          </p>
        </div>
      </footer>
    </div>
  );
}
