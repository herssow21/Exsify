import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Star,
  ExternalLink
} from 'lucide-react';
import { useNews } from '../../hooks/useDatabase';
import type { News } from '../../types';
import { useToast } from '../../context/ToastContext';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';

interface NewsFormData {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  category: string;
  imageUrl: string;
  featured: boolean;
}

const newsCategories = ['Company News', 'Product Update', 'Partnership', 'Event', 'Press Release'];

export default function NewsManager() {
  const { t, i18n } = useTranslation();
  const { news, loading, create, update, remove } = useNews();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingNews, setDeletingNews] = useState<News | null>(null);

  const [formData, setFormData] = useState<NewsFormData>({
    title_en: '',
    title_ar: '',
    content_en: '',
    content_ar: '',
    category: 'Company News',
    imageUrl: '',
    featured: false
  });

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.title_en.toLowerCase().includes(searchLower) ||
        item.title_ar.toLowerCase().includes(searchLower) ||
        item.content_en.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    });
  }, [news, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_en || !formData.title_ar || !formData.content_en || !formData.content_ar) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newsData = {
      ...formData,
      publishedAt: new Date().toISOString()
    };

    if (editingNews) {
      update(editingNews.id, newsData);
      showToast('News updated successfully', 'success');
    } else {
      create(newsData);
      showToast('News published successfully', 'success');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ar: '',
      content_en: '',
      content_ar: '',
      category: 'Company News',
      imageUrl: '',
      featured: false
    });
    setIsFormOpen(false);
    setEditingNews(null);
  };

  const handleEdit = (item: News) => {
    setEditingNews(item);
    setFormData({
      title_en: item.title_en,
      title_ar: item.title_ar,
      content_en: item.content_en,
      content_ar: item.content_ar,
      category: item.category || 'Company News',
      imageUrl: item.imageUrl,
      featured: item.featured
    });
    setIsFormOpen(true);
  };

  const handleDelete = (item: News) => {
    setDeletingNews(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingNews) {
      remove(deletingNews.id);
      showToast('News deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setDeletingNews(null);
    }
  };

  const handleToggleFeatured = (item: News) => {
    update(item.id, { featured: !item.featured });
    showToast(`News ${!item.featured ? 'marked as' : 'removed from'} featured`, 'success');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[hsl(var(--exsify-primary))] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin.news')}</h1>
          <p className="text-gray-300">Manage news and updates</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add News
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search news..."
          className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
        />
      </div>

      {/* News Form */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            {editingNews ? 'Edit News' : 'Add New News'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Title (English) *</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={e => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Title (Arabic) *</label>
                <input
                  type="text"
                  value={formData.title_ar}
                  onChange={e => setFormData(prev => ({ ...prev, title_ar: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Content (English) *</label>
                <textarea
                  value={formData.content_en}
                  onChange={e => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Content (Arabic) *</label>
                <textarea
                  value={formData.content_ar}
                  onChange={e => setFormData(prev => ({ ...prev, content_ar: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                >
                  {newsCategories.map(cat => (
                    <option key={cat} value={cat} className="bg-[hsl(var(--exsify-dark))]">{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 rounded border-[hsl(var(--exsify-primary))]/30 bg-white/5 text-[hsl(var(--exsify-primary))] focus:ring-[hsl(var(--exsify-primary))]"
                />
                <span className="text-sm text-gray-200">Featured</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 text-gray-200 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
              >
                {editingNews ? 'Update' : 'Publish'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 overflow-hidden hover:border-[hsl(var(--exsify-primary))]/40 transition-all"
          >
            {item.imageUrl && (
              <div className="h-40 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={isRTL ? item.title_ar : item.title_en}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-white font-bold line-clamp-2">
                    {isRTL ? item.title_ar : item.title_en}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1 flex-wrap">
                    <span className="px-2 py-0.5 bg-[hsl(var(--exsify-primary))]/20 text-[hsl(var(--exsify-primary))] text-xs rounded">
                      {item.category || 'General'}
                    </span>
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.publishedAt)}
                  </div>
                </div>
                {item.featured && (
                  <span className="px-2 py-1 bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))] text-xs rounded-full flex-shrink-0">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                {isRTL ? item.content_ar : item.content_en}
              </p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleToggleFeatured(item)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.featured
                      ? 'bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))]'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Star className={`w-4 h-4 ${item.featured ? 'fill-[hsl(var(--exsify-accent))]' : ''}`} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-[hsl(var(--exsify-primary))]/20">
          <p className="text-gray-400">No news found</p>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingNews(null);
        }}
        onConfirm={confirmDelete}
        title="Delete News"
        message="Are you sure you want to delete this news item? This action cannot be undone."
        itemName={isRTL ? deletingNews?.title_ar : deletingNews?.title_en}
      />
    </div>
  );
}
