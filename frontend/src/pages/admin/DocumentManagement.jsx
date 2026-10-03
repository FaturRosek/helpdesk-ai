import { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load documents.");
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
      setSuccess(`Document "${res.data.data.file_name}" successfully indexed into ${res.data.data.chunk_count} chunks.`);
      setFile(null);
      e.target.reset();
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReprocess(id) {
    try {
      await api.post(`/documents/${id}/process`);
      setSuccess("Document reprocessed successfully.");
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reprocess document.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this document and all its indexed chunks?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setSuccess("Document deleted successfully.");
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete document.");
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await api.get(`/documents/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Semantic search test failed.");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents & Knowledge RAG</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload SOPs, manuals, or policy files to index into semantic chunks for AI Assistant retrieval.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold cursor-pointer">&times;</button>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-emerald-500 hover:text-emerald-700 font-bold cursor-pointer">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6">
          <Card padding="p-5" className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                +
              </span>
              <span>Upload Document</span>
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Supported formats (PDF, TXT, MD, CSV, DOCX)
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-lg p-1.5"
                />
              </div>

              <Button
                type="submit"
                disabled={uploading || !file}
                className="w-full text-xs py-2.5"
              >
                {uploading ? "Extracting & Chunking..." : "Upload & Index Knowledge"}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Test Semantic Search
              </h3>
              <form onSubmit={handleSearch} className="space-y-2">
                <input
                  type="text"
                  placeholder="Ask question to test chunk match..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={searching}
                  className="w-full text-xs"
                >
                  {searching ? "Searching..." : "Test RAG Query"}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card padding="p-0" className="overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-slate-900">Indexed Knowledge Documents ({documents.length})</h2>
                <p className="text-xs text-slate-500">Live library used for response generation</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchDocuments}
              >
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="p-6">
                <Skeleton lines={4} />
              </div>
            ) : documents.length === 0 ? (
              <EmptyState
                title="No documents indexed"
                description="Upload your first documentation file to empower the AI Assistant with contextual knowledge."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-slate-500 uppercase tracking-wider border-b border-slate-200 text-[11px] font-semibold">
                    <tr>
                      <th className="px-5 py-3">Document Name</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Chunks</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">📄</span>
                            <span className="truncate max-w-xs">{doc.file_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{formatBytes(doc.size_bytes)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              doc.status === "PROCESSED" || doc.status === "INDEXED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : doc.status === "FAILED"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {doc.status || "INDEXED"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-blue-600">
                          {doc.chunk_count || 0}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleReprocess(doc.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                          >
                            Reprocess
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {searchResults.length > 0 && (
            <Card padding="p-5" className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">
                  Semantic Results ({searchResults.length} chunks matched)
                </h3>
                <span className="text-xs text-slate-400">Query: "{searchQuery}"</span>
              </div>
              <div className="space-y-2.5">
                {searchResults.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{item.file_name} &bull; Chunk #{item.chunk_index}</span>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 text-[10px] font-bold">
                        Relevance: {item.score}
                      </span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
