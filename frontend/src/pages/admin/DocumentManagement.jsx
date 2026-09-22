import { useState, useEffect } from "react";
import api from "../../services/api";

export default function DocumentManagement() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await api.get("/documents");
      setDocuments(res.data.data || []);
    } catch {
      setError("Gagal memuat daftar dokumen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(`Dokumen "${res.data.data.file_name}" berhasil diproses ke dalam ${res.data.data.chunk_count} chunk teks.`);
      setFile(null);
      e.target.reset();
      fetchDocuments();
    } catch {
      setError(err.response?.data?.message || "Gagal mengunggah dokumen.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReprocess(id) {
    try {
      await api.post(`/documents/${id}/process`);
      setSuccess("Dokumen berhasil diproses ulang.");
      fetchDocuments();
    } catch {
      setError("Gagal memproses ulang dokumen.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus dokumen ini beserta semua potongan chunk pengetahuan?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setSuccess("Dokumen berhasil dihapus.");
      fetchDocuments();
    } catch {
      setError("Gagal menghapus dokumen.");
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.get(`/documents/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.data || []);
    } catch {
      setError("Pencarian RAG gagal.");
    } finally {
      setSearching(false);
    }
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Dokumen & RAG</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Unggah SOP, buku panduan, atau berkas pengetahuan untuk diindeks oleh AI Retrieval-Augmented Generation
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700 font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-semibold">
              +
            </span>
            Unggah Dokumen Baru
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Pilih Berkas (PDF, TXT, MD, CSV, DOCX)
              </label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-slate-200 rounded-lg p-1.5"
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Memproses & Chunking...
                </>
              ) : (
                "Unggah & Ekstrak Pengetahuan"
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
              Uji Coba Pencarian Semantik RAG
            </h3>
            <form onSubmit={handleSearch} className="space-y-2">
              <input
                type="text"
                placeholder="Ketik pertanyaan untuk mencari chunk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={searching}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
              >
                {searching ? "Mencari Konteks..." : "Uji Konteks RAG"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Basis Berkas Pengetahuan ({documents.length})</h2>
              <button
                onClick={fetchDocuments}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Segarkan
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-3xl mb-2">📁</p>
                <p className="font-medium text-slate-700">Belum ada dokumen yang diunggah</p>
                <p className="text-xs mt-1 text-slate-400">Unggah file pertama untuk memperkaya wawasan AI Assistant</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3">Nama Dokumen</th>
                      <th className="px-4 py-3">Ukuran</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Chunk</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">📄</span>
                            <span className="truncate max-w-xs">{doc.file_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">{formatBytes(doc.size_bytes)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              doc.status === "PROCESSED"
                                ? "bg-green-100 text-green-700"
                                : doc.status === "FAILED"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-indigo-600">
                          {doc.chunk_count || 0}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleReprocess(doc.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Proses Ulang
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center justify-between">
                <span>Hasil Pencarian Semantik ({searchResults.length} potongan chunk)</span>
                <span className="text-xs text-slate-400 font-normal">Kueri: "{searchQuery}"</span>
              </h3>
              <div className="space-y-3">
                {searchResults.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-700">
                      <span>{item.file_name} &bull; Bagian #{item.chunk_index}</span>
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Skor Relevansi: {item.score}
                      </span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
