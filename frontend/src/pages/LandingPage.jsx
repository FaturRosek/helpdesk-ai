import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

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
      iconBg: "bg-blue-50 text-blue-600",
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
      iconBg: "bg-purple-50 text-purple-600",
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
      iconBg: "bg-amber-50 text-amber-600",
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
      iconBg: "bg-emerald-50 text-emerald-600",
    },
  ];

  const features = [
    {
      title: "Manajemen Dokumen & RAG",
      desc: "Unggah panduan SOP, buku manual teknis, dan dokumen kebijakan. Sistem otomatis memecah berkas menjadi chunk teks untuk menjawab kueri pelanggan dengan sumber otentik.",
      icon: "📚",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Mesin Otomasi SLA",
      desc: "Pemantauan tenggat resolusi per tingkat prioritas. Mendeteksi indikasi breach secara proaktif, mengeskalasi prioritas tiket, dan mengirim sinyal notifikasi ke tim.",
      icon: "⚡",
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "AI Assistant & Function Calling",
      desc: "Asisten AI terintegrasi yang dapat mengecek status tiket pelanggan, membuat tiket baru secara otomatis, dan mencari referensi pengetahuan seketika.",
      icon: "🤖",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "Catatan Internal Khusus Staf",
      desc: "Fitur komunikasi internal memungkinkan agen dan admin saling berdiskusi dalam konteks tiket tanpa terlihat oleh pelanggan untuk penanganan yang akurat.",
      icon: "🔒",
      color: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      title: "Analitik SLA & Kepuasan (CSAT)",
      desc: "Dashboard analitik komprehensif untuk memantau waktu resolusi tiket, tingkat kepatuhan SLA, kinerja agen, dan indeks kepuasan pelanggan secara real-time.",
      icon: "📈",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Pusat Notifikasi Terpadu",
      desc: "Peringatan penugasan tiket baru, notifikasi batas waktu SLA, dan pembaruan respon tiket dikirimkan langsung ke navbar pengguna dengan indikator baca real-time.",
      icon: "🔔",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  const faqs = [
    {
      q: "Bagaimana cara kerja AI Assistant dan RAG di HelpDesk AI?",
      a: "AI Assistant memanfaatkan model bahasa yang terhubung dengan basis pengetahuan dokumen perusahaan Anda melalui Retrieval-Augmented Generation (RAG). Setiap pertanyaan dicocokkan dengan dokumen SOP yang relevan untuk memberikan jawaban akurat dengan referensi sumber.",
    },
    {
      q: "Bagaimana sistem menghitung dan memantau batas waktu SLA?",
      a: "Setiap tiket otomatis dihitung batas waktunya berdasarkan tingkat prioritas (Urgent: 2 jam, High: 8 jam, Medium: 24 jam, Low: 48 jam). Sistem terus memantau tiket aktif, memicu eskalasi prioritas jika mendekati batas, dan mengirimkan notifikasi instan kepada tim.",
    },
    {
      q: "Apakah agen bisa menambahkan catatan yang tidak bisa dilihat pelanggan?",
      a: "Ya, sistem memiliki fitur Internal Notes khusus staf agen dan admin. Catatan tersebut hanya dapat dibaca oleh tim internal untuk koordinasi teknis.",
    },
    {
      q: "Format dokumen apa saja yang didukung untuk diindeks oleh sistem?",
      a: "Sistem mendukung berkas teks seperti TXT, Markdown, CSV, DOCX, dan berkas panduan PDF yang diekstrak menjadi potongan teks semantik (chunks).",
    },
  ];

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                HelpDesk AI
              </span>
              <span className="hidden sm:inline-block text-[10px] bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 rounded-full font-semibold">
                v2.0 Enterprise
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#workflow" className="hover:text-blue-600 transition-colors">Alur Sistem</a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">Peran Pengguna</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Fitur Unggulan</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <span>Buka Dashboard</span>
                <span className="text-xs">&rarr;</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
                >
                  Daftar Akun
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Platform Dukungan Pelanggan Cerdas Terintegrasi
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Solusi Tiket Lebih Cepat, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Agen Lebih Efektif dengan AI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              HelpDesk AI menggabungkan percakapan cerdas LLM, pencarian dokumen RAG (Retrieval-Augmented Generation), otomasi SLA, dan alur kerja agen terpadu dalam satu sistem yang tangguh.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5"
              >
                {user ? "Masuk ke Dashboard Saya" : "Mulai Registrasi Gratis"}
              </Link>
              <a
                href="#workflow"
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-xl text-sm transition-all shadow-sm"
              >
                Pelajari Alur Kerja Sistem &darr;
              </a>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> RAG Document Retrieval
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> Otomasi SLA & Escalation
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> Auto Assignment Tiket
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-600 font-bold">✓</span> 4 Tingkat Akses RBAC
              </span>
            </div>
          </div>

          <div className="mt-14 max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="ml-2 font-mono text-[11px] text-slate-600">helpdesk-ai // intelligent-flow-monitor</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Sistem Operasional Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold uppercase text-slate-500 tracking-wide">Pelanggan Mengirim Pertanyaan</p>
                <p className="text-sm font-medium text-slate-800 mt-2 italic">
                  "Bagaimana cara mereset password akun email korporat kami?"
                </p>
                <div className="mt-3 text-[10px] bg-blue-50 text-blue-700 p-2 rounded-lg border border-blue-200/60 font-medium">
                  ⚡ AI Assistant menganalisis intent: Keamanan Akun
                </div>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold uppercase text-slate-500 tracking-wide">RAG Context & Chunk Matching</p>
                <p className="text-xs text-slate-700 mt-2">
                  Ditemukan referensi di <span className="text-blue-600 font-semibold underline">SOP-Keamanan-2026.pdf</span> (Bagian #3)
                </p>
                <div className="mt-3 text-[10px] bg-purple-50 text-purple-700 p-2 rounded-lg border border-purple-200/60 font-medium">
                  🎯 Skor Relevansi 98% &bull; Menyiapkan solusi terverifikasi
                </div>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold uppercase text-slate-500 tracking-wide">SLA Engine & Penugasan</p>
                <p className="text-xs text-slate-700 mt-2">
                  Prioritas ditentukan: <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold text-[11px]">MEDIUM (24 Jam SLA)</span>
                </p>
                <div className="mt-3 text-[10px] bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-200/60 font-medium">
                  ✓ Ditugaskan otomatis ke Agen tersedia dengan notifikasi instan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-20 bg-slate-50/70 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              END-TO-END PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Alur Layanan Cerdas HelpDesk AI
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Setiap interaksi pelanggan diproses melalui tahapan cerdas yang mengoptimalkan kolaborasi AI dan staf agen demi resolusi prima.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {workflowSteps.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveWorkflow(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                  activeWorkflow === idx
                    ? "bg-white border-blue-600 shadow-lg shadow-blue-500/10 ring-2 ring-blue-600/20"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${item.color} text-white`}>
                      Tahap {item.step}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.badge}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-blue-600 font-semibold">{item.stats}</span>
                  <span className="text-slate-400 font-bold">&rarr;</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Fokus Tahap Terpilih</span>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                Tahap {workflowSteps[activeWorkflow].step}: {workflowSteps[activeWorkflow].title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {workflowSteps[activeWorkflow].desc}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/dashboard/ai-chat"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20"
              >
                Coba Fitur AI Chat
              </Link>
              <Link
                to="/dashboard/tickets/new"
                className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-sm"
              >
                Buat Tiket Uji Coba
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              AKSES BERBASIS PERAN (RBAC)
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Dibuat untuk 4 Peran Pengguna Utama
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Setiap pengguna mendapatkan ruang kerja yang disesuaikan secara presisi dengan tanggung jawab masing-masing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-xl ${r.iconBg} flex items-center justify-center text-xl`}>
                      {r.icon}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                      {r.roleTag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{r.name}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{r.desc}</p>
                  </div>
                  <div className="pt-2 space-y-2">
                    {r.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to="/login"
                    className="w-full block text-center py-2 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                  >
                    Masuk sebagai {r.name.split(" ")[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-50/70 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              KAPABILITAS UTAMA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Fitur & Kapabilitas Unggulan Sistem
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Solusi customer support cerdas yang dirancang untuk kecepatan respon, kepatuhan SLA, dan kemudahan manajemen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl ${feat.color} border flex items-center justify-center text-lg font-bold`}>
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-sm text-slate-500">Jawaban seputar fungsionalitas dan pemanfaatan sistem HelpDesk AI</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-slate-900 hover:bg-slate-50 font-semibold text-sm transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-slate-400 text-xs transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-blue-600/20 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tingkatkan Standar Layanan Pelanggan Sekarang
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan ekosistem HelpDesk AI untuk menyelesaikan tiket lebih cepat, menata dokumen pengetahuan, dan memantau kepatuhan SLA secara terukur.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-700 font-bold rounded-xl text-sm shadow-md transition-all transform hover:-translate-y-0.5"
              >
                Daftar Akun Baru
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 bg-blue-700/60 hover:bg-blue-700 border border-blue-400/40 text-white font-semibold rounded-xl text-sm transition-all"
              >
                Masuk Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              H
            </div>
            <span className="font-semibold text-slate-800">HelpDesk AI</span>
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
