import { useState, useRef, type ChangeEvent } from "react";
import { Upload, X, File, Image, Archive, FileText, Check, Link2, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onUpload: (url: string, fileName?: string) => void;
  accept?: string;
  label?: string;
  uploadedBy?: string;
  currentUrl?: string;
}

export default function FileUpload({
  onUpload,
  accept = "*/*",
  label = "Upload File",
  uploadedBy = "admin",
  currentUrl = "",
}: FileUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);

    // Preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Upload
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadedBy", uploadedBy);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        onUpload(data.url, data.originalName);
        setError(null);
      } else {
        setError(data.error || "Upload failed. Try using URL mode.");
        console.error("Upload error:", data.error);
      }
    } catch (err) {
      const msg = "Backend server not running. Switch to URL mode to paste a link.";
      setError(msg);
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUpload(urlInput.trim());
      setError(null);
    }
  };

  const isImage = accept.includes("image");
  const IconComp = isImage ? Image : accept.includes("zip") ? Archive : FileText;

  return (
    <div className="w-full space-y-2">
      {/* Mode Toggle */}
      <div className="flex items-center gap-1 p-0.5 bg-white/5 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => { setMode("upload"); setError(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "upload"
              ? "bg-[hsl(var(--exsify-primary))] text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Upload className="w-3 h-3" />
          Upload
        </button>
        <button
          type="button"
          onClick={() => { setMode("url"); setError(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === "url"
              ? "bg-[hsl(var(--exsify-primary))] text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Link2 className="w-3 h-3" />
          URL
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {mode === "upload" ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          {!fileName ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-[hsl(var(--exsify-primary))]/30 rounded-xl hover:border-[hsl(var(--exsify-primary))]/60 hover:bg-[hsl(var(--exsify-primary))]/5 transition-all group disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-[hsl(var(--exsify-primary))]/10 flex items-center justify-center text-[hsl(var(--exsify-primary))] group-hover:bg-[hsl(var(--exsify-primary))]/20 transition-colors">
                {uploading ? (
                  <div className="w-5 h-5 border-2 border-[hsl(var(--exsify-primary))] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IconComp className="w-6 h-6" />
                )}
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-sm">
                  {uploading ? "Uploading..." : label}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Click to browse or drag & drop
                </p>
                <p className="text-gray-600 text-xs">Max 20MB</p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-[hsl(var(--exsify-primary))]/20">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[hsl(var(--exsify-primary))]/10 flex items-center justify-center">
                  <File className="w-5 h-5 text-[hsl(var(--exsify-primary))]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{fileName}</p>
                {uploading ? (
                  <p className="text-gray-500 text-xs">Uploading...</p>
                ) : (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> Uploaded — URL saved to form
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* URL Mode */
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
              placeholder="https://example.com/file.png"
              className="flex-1 px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none text-sm"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors text-sm font-medium"
            >
              Apply
            </button>
          </div>
          <p className="text-gray-600 text-xs">Paste a direct link to the file</p>
        </div>
      )}

      {/* Current URL Display */}
      {currentUrl && !fileName && (
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
          {isImage && currentUrl.startsWith("http") ? (
            <img src={currentUrl} alt="Current" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--exsify-primary))]/10 flex items-center justify-center">
              <IconComp className="w-5 h-5 text-[hsl(var(--exsify-primary))]" />
            </div>
          )}
          <p className="text-gray-400 text-xs flex-1 truncate">{currentUrl}</p>
        </div>
      )}
    </div>
  );
}
