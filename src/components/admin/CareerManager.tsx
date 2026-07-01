import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Briefcase,
  MapPin,
  Clock,
} from 'lucide-react';
import { useCareers } from '../../hooks/useDatabase';
import type { Career, CareerType, CareerStatus } from '../../types';
import { useToast } from '../../context/ToastContext';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';

interface CareerFormData {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  department: string;
  location: string;
  type: CareerType;
  status: CareerStatus;
  featured: boolean;
}

const careerTypes: CareerType[] = ['full-time', 'part-time', 'contract', 'remote'];
const careerStatuses: CareerStatus[] = ['active', 'inactive', 'closed'];

export default function CareerManager() {
  const { t, i18n } = useTranslation();
  const { careers, loading, create, update, remove } = useCareers();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCareer, setDeletingCareer] = useState<Career | null>(null);

  const [formData, setFormData] = useState<CareerFormData>({
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    department: '',
    location: '',
    type: 'full-time',
    status: 'active',
    featured: false,
  });

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        career.title_en.toLowerCase().includes(searchLower) ||
        career.title_ar.toLowerCase().includes(searchLower) ||
        career.department.toLowerCase().includes(searchLower) ||
        career.location.toLowerCase().includes(searchLower)
      );
    });
  }, [careers, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_en || !formData.title_ar) {
      showToast('Please fill in the job titles in both languages', 'error');
      return;
    }

    if (editingCareer) {
      update(editingCareer.id, formData);
      showToast('Career updated successfully', 'success');
    } else {
      create(formData);
      showToast('Career posted successfully', 'success');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      department: '',
      location: '',
      type: 'full-time',
      status: 'active',
      featured: false,
    });
    setIsFormOpen(false);
    setEditingCareer(null);
  };

  const handleEdit = (career: Career) => {
    setEditingCareer(career);
    setFormData({
      title_en: career.title_en,
      title_ar: career.title_ar,
      description_en: career.description_en,
      description_ar: career.description_ar,
      department: career.department,
      location: career.location,
      type: career.type,
      status: career.status,
      featured: career.featured,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (career: Career) => {
    setDeletingCareer(career);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingCareer) {
      remove(deletingCareer.id);
      showToast('Career deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setDeletingCareer(null);
    }
  };

  const handleToggleFeatured = (career: Career) => {
    update(career.id, { featured: !career.featured });
    showToast(`Career ${!career.featured ? 'marked as' : 'removed from'} featured`, 'success');
  };

  const handleStatusChange = (career: Career, status: CareerStatus) => {
    update(career.id, { status });
    showToast(`Status updated to ${status}`, 'success');
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
          <h1 className="text-3xl font-bold text-white mb-2">Careers</h1>
          <p className="text-gray-300">Manage job postings and openings</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Career
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search careers..."
          className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
        />
      </div>

      {/* Career Form */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            {editingCareer ? 'Edit Career' : 'Add New Career'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Title (English) *</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Title (Arabic) *</label>
                <input
                  type="text"
                  value={formData.title_ar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title_ar: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Description (English)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description_en: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Description (Arabic)</label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description_ar: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as CareerType }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                >
                  {careerTypes.map((type) => (
                    <option key={type} value={type} className="bg-[hsl(var(--exsify-dark))]">
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as CareerStatus }))}
                  className="w-full px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                >
                  {careerStatuses.map((status) => (
                    <option key={status} value={status} className="bg-[hsl(var(--exsify-dark))]">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
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
                {editingCareer ? 'Update' : 'Publish'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Careers Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(var(--exsify-primary))]/20">
        <table className="w-full text-left text-sm">
          <thead className="bg-[hsl(var(--exsify-dark-lighter))] text-gray-300">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--exsify-primary))]/10">
            {filteredCareers.map((career) => (
              <tr key={career.id} className="bg-white/5 hover:bg-white/10 transition-colors">
                <td className="px-4 py-3 text-white font-medium">
                  {isRTL ? career.title_ar : career.title_en}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    {career.department}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {career.location}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {career.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={career.status}
                    onChange={(e) => handleStatusChange(career, e.target.value as CareerStatus)}
                    className="bg-transparent text-gray-300 text-xs border border-[hsl(var(--exsify-primary))]/30 rounded px-2 py-1 focus:outline-none"
                  >
                    {careerStatuses.map((status) => (
                      <option key={status} value={status} className="bg-[hsl(var(--exsify-dark))]">
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleFeatured(career)}
                    className={`p-2 rounded-lg transition-colors ${
                      career.featured
                        ? 'bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))]'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${career.featured ? 'fill-[hsl(var(--exsify-accent))]' : ''}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(career)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(career)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCareers.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-[hsl(var(--exsify-primary))]/20">
          <p className="text-gray-400">No careers found</p>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCareer(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Career"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        itemName={isRTL ? deletingCareer?.title_ar : deletingCareer?.title_en}
      />
    </div>
  );
}
