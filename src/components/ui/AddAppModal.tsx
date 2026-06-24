import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { App } from '../../types';
import FileUpload from './FileUpload';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: Omit<App, 'id'>) => void;
}

const initialForm: Omit<App, 'id'> = {
  slug: '',
  name_en: '',
  name_ar: '',
  description_en: '',
  description_ar: '',
  shortDescription_en: '',
  shortDescription_ar: '',
  price_usd: 0,
  rating: 4.5,
  totalReviews: 0,
  downloadCount: 0,
  category: 'Retail',
  icon: 'Package',
  screenshots: [],
  features_en: [],
  features_ar: [],
  tags: [],
  regionsAvailable: ['Kenya', 'Saudi Arabia'],
  status: 'active',
  featured: false,
  downloadUrl: '',
};

export default function AddAppModal({ isOpen, onClose, onAdd }: AddAppModalProps) {
  const [form, setForm] = useState<Omit<App, 'id'>>(initialForm);
  const [featureInput, setFeatureInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm(initialForm);
    setFeatureInput('');
    setTagInput('');
    onClose();
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm(prev => ({
        ...prev,
        features_en: [...prev.features_en, featureInput.trim()],
        features_ar: [...prev.features_ar, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
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
              <h2 className="text-xl font-bold text-white">Add New App</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Slug (URL-friendly ID)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  placeholder="kaatib-pos"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">Used in URLs: /app/your-slug</p>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name (EN) *</label>
                  <input
                    type="text"
                    value={form.name_en}
                    onChange={e => setForm(prev => ({ ...prev, name_en: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    placeholder="KaatibPOS"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name (AR) *</label>
                  <input
                    type="text"
                    value={form.name_ar}
                    onChange={e => setForm(prev => ({ ...prev, name_ar: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    placeholder="كاتب بوينت"
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
                    value={form.shortDescription_en}
                    onChange={e => setForm(prev => ({ ...prev, shortDescription_en: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    placeholder="Brief tagline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Short Description (AR)</label>
                  <input
                    type="text"
                    value={form.shortDescription_ar}
                    onChange={e => setForm(prev => ({ ...prev, shortDescription_ar: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    placeholder="وصف مختصر"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Full Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Description (EN)</label>
                  <textarea
                    value={form.description_en}
                    onChange={e => setForm(prev => ({ ...prev, description_en: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                    placeholder="Detailed description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Description (AR)</label>
                  <textarea
                    value={form.description_ar}
                    onChange={e => setForm(prev => ({ ...prev, description_ar: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                    placeholder="وصف مفصل..."
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Price, Category, Rating */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={form.price_usd}
                    onChange={e => setForm(prev => ({ ...prev, price_usd: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category}
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Rating (0-5)</label>
                  <input
                    type="number"
                    value={form.rating}
                    onChange={e => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                </div>
              </div>

              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">App Icon</label>
                <FileUpload
                  label="Upload App Icon"
                  accept="image/*"
                  onUpload={(url) => setForm(prev => ({ ...prev, icon: url }))}
                  currentUrl={form.icon && form.icon !== 'Package' ? form.icon : ''}
                />
              </div>

              {/* Screenshots Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Screenshots</label>
                <FileUpload
                  label="Upload Screenshot"
                  accept="image/*"
                  onUpload={(url) => setForm(prev => ({ ...prev, screenshots: [...prev.screenshots, url] }))}
                  currentUrl={form.screenshots.length > 0 ? `${form.screenshots.length} screenshot(s) added` : ''}
                />
                {form.screenshots.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.screenshots.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Screenshot ${i + 1}`} className="w-20 h-20 rounded-lg object-cover" />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, idx) => idx !== i) }))}
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
                  currentUrl={form.downloadUrl}
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    placeholder="Add a feature and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {form.features_en.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.features_en.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-[hsl(var(--exsify-primary))]/20 text-[hsl(var(--exsify-primary))] text-xs rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2.5 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/30 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                    placeholder="Add a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {(form.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(form.tags || []).map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))] text-xs rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[hsl(var(--exsify-primary))]/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add App
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
