import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Trash2,
  Mail,
  Calendar,
  Download,
  Filter,
  FileText,
  Briefcase,
  X,
  Check,
} from 'lucide-react';
import { useJobApplications } from '../../hooks/useDatabase';
import type { JobApplication } from '../../types';
import { useToast } from '../../context/ToastContext';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';

const statusOptions: JobApplication['status'][] = ['new', 'reviewed', 'shortlisted', 'rejected'];

export default function JobApplicationManager() {
  const { t } = useTranslation();
  const { applications, loading, updateStatus, remove } = useJobApplications();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | JobApplication['status']>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<JobApplication | null>(null);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  const handleStatusChange = (app: JobApplication, status: JobApplication['status']) => {
    updateStatus(app.id, status);
    showToast(`Application marked as ${status}`, 'success');
  };

  const handleDelete = (app: JobApplication) => {
    setDeleting(app);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleting) {
      remove(deleting.id);
      showToast('Application deleted', 'success');
      setIsDeleteModalOpen(false);
      setDeleting(null);
    }
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}?subject=RE: Your Job Application - EXSIFY`, '_blank');
  };

  const handleDownloadCv = (app: JobApplication) => {
    if (!app.cvData || !app.cvName) return;
    const a = document.createElement('a');
    a.href = app.cvData;
    a.download = app.cvName;
    a.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-500/20 text-amber-400';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-400';
      case 'shortlisted':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[hsl(var(--exsify-primary))] border-t-transparent rounded-full" />
      </div>
    );
  }

  const pendingCount = applications.filter((a) => a.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Applications</h1>
          <p className="text-gray-300">
            Manage career applicants ({pendingCount} pending)
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or position..."
            className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | JobApplication['status'])}
            className="px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          >
            <option value="all" className="bg-[hsl(var(--exsify-dark))]">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s} className="bg-[hsl(var(--exsify-dark))]">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filtered.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6 hover:border-[hsl(var(--exsify-primary))]/40 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-white font-bold text-lg">{app.name}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-3">
                  <button
                    onClick={() => handleEmail(app.email)}
                    className="flex items-center gap-1 hover:text-[hsl(var(--exsify-primary))] transition-colors group"
                    title="Click to reply via email"
                  >
                    <Mail className="w-4 h-4 group-hover:text-[hsl(var(--exsify-primary))]" />
                    <span className="underline underline-offset-2">{app.email}</span>
                  </button>

                  {app.jobTitle && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {app.jobTitle}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(app.appliedAt)}
                  </div>
                </div>

                {app.message && (
                  <p className="text-gray-200 text-sm bg-white/5 p-3 rounded-lg mb-3">
                    {app.message}
                  </p>
                )}

                {app.cvName && (
                  <button
                    onClick={() => handleDownloadCv(app)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[hsl(var(--exsify-primary))]/20 text-[hsl(var(--exsify-primary))] text-xs rounded hover:bg-[hsl(var(--exsify-primary))]/30 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {app.cvName}
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app, e.target.value as JobApplication['status'])}
                  className="px-3 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white text-sm focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s} className="bg-[hsl(var(--exsify-dark))]">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(app)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete application"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-[hsl(var(--exsify-primary))]/20">
            <p className="text-gray-400">No applications found</p>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleting(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
        itemName={deleting?.name}
      />
    </div>
  );
}
