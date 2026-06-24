import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image,
  FileText,
  Archive,
  File,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  X,
  FolderOpen,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface MediaFile {
  id: number;
  originalName: string;
  fileName: string;
  mimeType: string | null;
  size: number | null;
  url: string;
  type: string;
  uploadedBy: string | null;
  createdAt: Date;
}

const typeFilters = [
  { key: "all", label: "All Files", icon: FolderOpen },
  { key: "image", label: "Images", icon: Image },
  { key: "document", label: "Documents", icon: FileText },
  { key: "archive", label: "Archives", icon: Archive },
  { key: "other", label: "Other", icon: File },
] as const;

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return Image;
    case "document":
      return FileText;
    case "archive":
      return Archive;
    default:
      return File;
  }
}

export default function MediaManager() {
  const { showToast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/trpc/upload.list");
      const json = await res.json();
      if (json.result?.data) {
        setFiles(json.result.data);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/upload/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("File deleted successfully", "success");
        setFiles((prev) => prev.filter((f) => f.id !== id));
      } else {
        showToast("Failed to delete file", "error");
      }
    } catch {
      showToast("Failed to delete file", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = (url: string, id: number) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    showToast("URL copied to clipboard", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadedBy", "admin");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        showToast("File uploaded successfully", "success");
        fetchFiles();
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch {
      showToast("Upload failed", "error");
    }

    // Reset input
    e.target.value = "";
  };

  const filtered = files.filter((f) => {
    const matchType = activeFilter === "all" || f.type === activeFilter;
    const matchSearch =
      !searchQuery ||
      f.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="w-6 h-6 text-[hsl(var(--exsify-accent))]" />
            <h2 className="text-2xl font-bold text-white">Media Library</h2>
          </div>
          <label className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors font-semibold cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload File
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-gray-400">
          Manage all uploaded files. Upload images, documents, and archives for use across the platform.
        </p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-4"
      >
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? "bg-[hsl(var(--exsify-primary))] text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      {/* File Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[hsl(var(--exsify-primary))] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No files found</p>
          <p className="text-gray-600 text-sm mt-1">
            Upload your first file to get started
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((file, i) => {
            const Icon = getFileIcon(file.type);
            const isImage = file.type === "image";

            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-[hsl(var(--exsify-primary))]/30 transition-all group"
              >
                {/* Preview */}
                <div className="h-40 bg-black/30 flex items-center justify-center relative overflow-hidden">
                  {isImage ? (
                    <img
                      src={file.url}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Icon className="w-12 h-12 text-gray-500" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopy(file.url, file.id)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === file.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      disabled={deletingId === file.id}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                      title="Delete"
                    >
                      {deletingId === file.id ? (
                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-white text-sm font-medium truncate">
                    {file.originalName}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="uppercase">{file.type}</span>
                    <span>{formatSize(file.size)}</span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
