import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Check,
  Trash2,
  Mail,
  Building2,
  Calendar,
  Download,
  Filter,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';
import { useConsultations } from '../../hooks/useDatabase';
import type { Consultation } from '../../types';
import { useToast } from '../../context/ToastContext';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';
import { exportConsultationsToCSV } from '../../utils/dbOperations';

export default function ConsultationManager() {
  const { t } = useTranslation();
  const { consultations, loading, updateStatus, remove } = useConsultations();
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingConsultation, setDeletingConsultation] = useState<Consultation | null>(null);

  const filteredConsultations = useMemo(() => {
    return consultations.filter(consultation => {
      const matchesSearch = 
        consultation.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.serviceInterest?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [consultations, searchQuery, statusFilter]);

  const handleMarkContacted = (consultation: Consultation) => {
    updateStatus(consultation.id, 'contacted');
    showToast('Marked as contacted', 'success');
  };

  const handleMarkClosed = (consultation: Consultation) => {
    updateStatus(consultation.id, 'closed');
    showToast('Marked as closed', 'success');
  };

  const handleReopen = (consultation: Consultation) => {
    updateStatus(consultation.id, 'new');
    showToast('Reopened consultation', 'success');
  };

  const handleDelete = (consultation: Consultation) => {
    setDeletingConsultation(consultation);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingConsultation) {
      remove(deletingConsultation.id);
      showToast('Consultation deleted', 'success');
      setIsDeleteModalOpen(false);
      setDeletingConsultation(null);
    }
  };

  const handleExport = () => {
    const csv = exportConsultationsToCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Consultations exported successfully', 'success');
  };

  const handleEmailReply = (email: string) => {
    window.open(`mailto:${email}?subject=RE: Your Consultation Request - EXSIFY`, '_blank');
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-500/20 text-amber-400';
      case 'contacted':
        return 'bg-blue-500/20 text-blue-400';
      case 'closed':
        return 'bg-green-500/20 text-green-400';
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

  const pendingCount = consultations.filter(c => c.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin.consultations')}</h1>
          <p className="text-gray-300">
            Manage consultation requests ({pendingCount} pending)
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
            placeholder="Search by name, email, company or service..."
            className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'new' | 'contacted' | 'closed')}
            className="px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          >
            <option value="all" className="bg-[hsl(var(--exsify-dark))]">All Status</option>
            <option value="new" className="bg-[hsl(var(--exsify-dark))]">New</option>
            <option value="contacted" className="bg-[hsl(var(--exsify-dark))]">Contacted</option>
            <option value="closed" className="bg-[hsl(var(--exsify-dark))]">Closed</option>
          </select>
        </div>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 text-white rounded-lg hover:bg-[hsl(var(--exsify-dark-lighter))] transition-colors"
        >
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation, index) => (
          <motion.div
            key={consultation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6 hover:border-[hsl(var(--exsify-primary))]/40 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-white font-bold text-lg">{consultation.fullName}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(consultation.status)}`}>
                    {consultation.status === 'new' ? 'New' : consultation.status === 'contacted' ? 'Contacted' : 'Closed'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-3">
                  {/* Clickable Email */}
                  <button
                    onClick={() => handleEmailReply(consultation.email)}
                    className="flex items-center gap-1 hover:text-[hsl(var(--exsify-primary))] transition-colors group"
                    title="Click to reply via email"
                  >
                    <Mail className="w-4 h-4 group-hover:text-[hsl(var(--exsify-primary))]" />
                    <span className="underline underline-offset-2">{consultation.email}</span>
                  </button>
                  
                  {/* Phone/WhatsApp */}
                  {consultation.phone && (
                    <button
                      onClick={() => handleWhatsApp(consultation.phone!)}
                      className="flex items-center gap-1 hover:text-green-400 transition-colors group"
                      title="Click to open WhatsApp"
                    >
                      <Phone className="w-4 h-4 group-hover:text-green-400" />
                      <span className="underline underline-offset-2">{consultation.phone}</span>
                      <MessageCircle className="w-3 h-3 text-green-400" />
                    </button>
                  )}

                  {consultation.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {consultation.company}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(consultation.submittedAt)}
                  </div>
                </div>

                {/* Service Interest & Budget */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-[hsl(var(--exsify-primary))]/20 text-[hsl(var(--exsify-primary))] text-xs rounded">
                    {consultation.serviceInterest}
                  </span>
                  {consultation.budget && (
                    <span className="px-2 py-1 bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))] text-xs rounded">
                      Budget: {consultation.budget}
                    </span>
                  )}
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                    {consultation.country}
                  </span>
                </div>

                <p className="text-gray-200 text-sm bg-white/5 p-3 rounded-lg">
                  {consultation.projectDetails}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {consultation.status === 'new' && (
                  <button
                    onClick={() => handleMarkContacted(consultation)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Mark Contacted
                  </button>
                )}
                {consultation.status === 'contacted' && (
                  <button
                    onClick={() => handleMarkClosed(consultation)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Close
                  </button>
                )}
                {consultation.status === 'closed' && (
                  <button
                    onClick={() => handleReopen(consultation)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => handleDelete(consultation)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete consultation"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-[hsl(var(--exsify-primary))]/20">
            <p className="text-gray-400">No consultations found</p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingConsultation(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Consultation"
        message="Are you sure you want to delete this consultation request? This action cannot be undone."
        itemName={deletingConsultation?.fullName}
      />
    </div>
  );
}
