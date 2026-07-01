import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Check,
  X,
  Trash2,
  Star,
  User,
  MapPin,
  Calendar,
  Filter
} from 'lucide-react';
import { useReviews, useApps } from '../../hooks/useDatabase';
import type { Review } from '../../types';
import { useToast } from '../../context/ToastContext';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';

export default function ReviewManager() {
  const { t, i18n } = useTranslation();
  const { reviews, loading, update, remove } = useReviews();
  const { apps } = useApps();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = 
        review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.text_en.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchQuery, statusFilter]);

  const getAppName = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app ? (isRTL ? app.name_ar : app.name_en) : 'Unknown App';
  };

  const handleApprove = (review: Review) => {
    update(review.id, { status: 'published' as const });
    showToast('Review approved', 'success');
  };

  const handleReject = (review: Review) => {
    update(review.id, { status: 'pending' as const });
    showToast('Review rejected', 'info');
  };

  const handleToggleFeatured = (review: Review) => {
    update(review.id, { featured: !review.featured });
    showToast(`Review ${!review.featured ? 'marked as' : 'removed from'} featured`, 'success');
  };

  const handleDelete = (review: Review) => {
    setDeletingReview(review);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingReview) {
      remove(deletingReview.id);
      showToast('Review deleted', 'success');
      setIsDeleteModalOpen(false);
      setDeletingReview(null);
    }
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

  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin.reviews')}</h1>
          <p className="text-gray-300">
            Manage user reviews ({pendingCount} pending approval)
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
            className="px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          >
            <option value="all" className="bg-[hsl(var(--exsify-dark))]">All Status</option>
            <option value="pending" className="bg-[hsl(var(--exsify-dark))]">Pending</option>
            <option value="approved" className="bg-[hsl(var(--exsify-dark))]">Approved</option>
            <option value="rejected" className="bg-[hsl(var(--exsify-dark))]">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6 hover:border-[hsl(var(--exsify-primary))]/40 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-accent))] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{review.userName}</h3>
                    <p className="text-gray-400 text-sm">{getAppName(review.appId || '')}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    review.approved
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {review.userCountry}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(review.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-gray-200 text-sm bg-white/5 p-3 rounded-lg">
                  "{isRTL ? review.text_ar : review.text_en}"
                </p>
              </div>

              <div className="flex items-center gap-2">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(review)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(review)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleToggleFeatured(review)}
                  title={review.featured ? 'Remove from featured' : 'Mark as featured'}
                  className={`p-2 rounded-lg transition-colors ${
                    review.featured
                      ? 'bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))]'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Star className={`w-5 h-5 ${review.featured ? 'fill-[hsl(var(--exsify-accent))]' : ''}`} />
                </button>
                <button
                  onClick={() => handleDelete(review)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-[hsl(var(--exsify-primary))]/20">
            <p className="text-gray-400">No reviews found</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingReview(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        itemName={deletingReview?.userName}
      />
    </div>
  );
}
