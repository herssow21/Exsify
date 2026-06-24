import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { App } from '../../types';
import FileUpload from './FileUpload';

interface EditAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: App | null;
  onSave: (appId: string, data: Partial<App>) => void;
}

export default function EditAppModal({ isOpen, onClose, app, onSave }: EditAppModalProps) {
  const [form, setForm] = useState<Partial<App>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (app) {
      setForm({
        name_en: app.name_en,
        name_ar: app.name_ar,
        description_en: app.description_en,
        description_ar: app.description_ar,
        icon: app.icon,
        screenshots: app.screenshots || [],
        price_usd: app.price_usd,
        category: app.category,
        status: app.status,
        featured: app.featured,
        downloadUrl: app.downloadUrl || '',
      });
    }
  }, [app]);

  if (!app) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSave(app.id, form);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-[hsl(var(--exsify-dark))] rounded-xl border border-[hsl(var(--exsify-primary))]/30 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--exsify-primary))]/20">
              <div>
                <h2 className="text-xl font-bold text-white">Edit App</h2>
                <p className="text-gray-400 text-sm mt-0.5">Update {app.name_en} details</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={form.name_en || ''}
                    onChange={e => setForm(prev => ({ ...prev, name_en: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name (AR)</label>
                  <input
                    type="text"
                    value={form.name_ar || ''}
                    onChange={e => setForm(prev => ({ ...prev, name_ar: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              {/* Short Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Short Description (EN)</label>
                  <input
                    type="text"
                    value={form.shortDescription_en || ''}
                    onChange={e => setForm(prev => ({ ...prev, shortDescription_en: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Short Description (AR)</label>
                  <input
                    type="text"
                    value={form.shortDescription_ar || ''}
                    onChange={e => setForm(prev => ({ ...prev, shortDescription_ar: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Full Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Description (EN)</label>
                  <textarea
                    value={form.description_en || ''}
                    onChange={e => setForm(prev => ({ ...prev, description_en: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Description (AR)</label>
                  <textarea
                    value={form.description_ar || ''}
                    onChange={e => setForm(prev => ({ ...prev, description_ar: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={form.price_usd || 0}
                    onChange={e => setForm(prev => ({ ...prev, price_usd: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category || ''}
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  >
                    <option value="Retail">Retail</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={form.status || ''}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">App Icon</label>
                <FileUpload
                  label="Upload New Icon"
                  accept="image/*"
                  onUpload={(url) => setForm(prev => ({ ...prev, icon: url }))}
                  currentUrl={form.icon && form.icon !== 'Package' ? form.icon : ''}
                />
              </div>

              {/* Screenshots Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Screenshots</label>
                <FileUpload
                  label="Add Screenshot"
                  accept="image/*"
                  onUpload={(url) => setForm(prev => ({ ...prev, screenshots: [...(prev.screenshots || []), url] }))}
                  currentUrl={(form.screenshots || []).length > 0 ? `${(form.screenshots || []).length} screenshot(s)` : ''}
                />
                {(form.screenshots || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.screenshots || []).map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Screenshot ${i + 1}`} className="w-20 h-20 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, screenshots: (prev.screenshots || []).filter((_, idx) => idx !== i) }))}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Download File */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Downloadable Package</label>
                <FileUpload
                  label="Upload Installer / Package"
                  accept=".exe,.dmg,.pkg,.deb,.rpm,.zip,.tar.gz,.apk,.ipa,.msi"
                  onUpload={(url) => setForm(prev => ({ ...prev, downloadUrl: url }))}
                  currentUrl={form.downloadUrl || ''}
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-3 p-4 bg-[hsl(var(--exsify-dark-lighter))] rounded-lg border border-[hsl(var(--exsify-primary))]/20">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured || false}
                  onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-600 text-[hsl(var(--exsify-primary))] focus:ring-[hsl(var(--exsify-primary))] bg-[hsl(var(--exsify-dark-lighter))]"
                />
                <label htmlFor="featured" className="text-white font-medium cursor-pointer select-none">
                  Featured App
                </label>
                <span className="text-gray-500 text-xs ml-auto">Show on homepage carousel</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50 font-semibold"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
