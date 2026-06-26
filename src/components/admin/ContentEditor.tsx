import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Save, RotateCcw, Globe, FileText } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import i18n from "../../i18n";

type FlatRecord = Record<string, string>;

function flatten(obj: unknown, prefix = ""): FlatRecord {
  const result: FlatRecord = {};
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "string") {
        result[newKey] = value;
      } else if (typeof value === "object" && value !== null) {
        Object.assign(result, flatten(value, newKey));
      }
    }
  }
  return result;
}

function unflatten(flat: FlatRecord): unknown {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split(".");
    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== "object") {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

const STORAGE_KEY = "exsify_translations_override";
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function ContentEditor() {
  const { showToast } = useToast();
  const [activeLang, setActiveLang] = useState("en");
  const [search, setSearch] = useState("");
  const [values, setValues] = useState<FlatRecord>({});

  const baseBundle = useMemo(() => {
    return flatten(i18n.getResourceBundle(activeLang, "translation"));
  }, [activeLang]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let overrides: Record<string, FlatRecord> = {};
    try {
      if (stored) overrides = JSON.parse(stored);
    } catch {
      overrides = {};
    }
    setValues({ ...baseBundle, ...(overrides[activeLang] || {}) });
  }, [activeLang, baseBundle]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return Object.entries(values)
      .filter(([key, value]) =>
        key.toLowerCase().includes(term) || value.toLowerCase().includes(term)
      )
      .sort(([a], [b]) => a.localeCompare(b));
  }, [values, search]);

  const handleChange = (key: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSave = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const overrides: Record<string, FlatRecord> = stored ? JSON.parse(stored) : {};
      overrides[activeLang] = { ...values };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));

      i18n.addResourceBundle(
        activeLang,
        "translation",
        unflatten(values) as Record<string, unknown>,
        true,
        true
      );
      i18n.changeLanguage(activeLang);

      showToast("Content saved and applied", "success");
    } catch {
      showToast("Failed to save content", "error");
    }
  };

  const handleReset = () => {
    if (!confirm("Reset all custom text to defaults? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setValues(baseBundle);
    i18n.addResourceBundle(
      activeLang,
      "translation",
      unflatten(baseBundle) as Record<string, unknown>,
      true,
      true
    );
    i18n.changeLanguage(activeLang);
    showToast("Content reset to defaults", "success");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-[hsl(var(--exsify-accent))]" />
          <h2 className="text-2xl font-bold text-white">Content Editor</h2>
        </div>
        <p className="text-gray-400">
          Edit website text in real time. Changes are saved to this browser and apply immediately.
        </p>
      </motion.div>

      {/* Language tabs + actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10"
      >
        <div className="flex items-center gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeLang === lang.code
                  ? "bg-[hsl(var(--exsify-primary))] text-white"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Globe className="w-4 h-4" />
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors text-sm font-semibold"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search text keys or content..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
        />
      </motion.div>

      {/* Editor rows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No matching text keys found.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filtered.map(([key, value]) => (
                <div key={key} className="p-4 hover:bg-white/5 transition-colors">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 font-mono">
                    {key}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={value.length > 80 ? 3 : 1}
                    className="w-full px-3 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-white/10 rounded-lg text-white text-sm focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-y"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <p className="text-gray-600 text-xs">
        Tip: Use the search box to quickly find labels like <code className="text-[hsl(var(--exsify-primary))]">hero.title</code> or{" "}
        <code className="text-[hsl(var(--exsify-primary))]">nav.contact</code>.
      </p>
    </div>
  );
}
