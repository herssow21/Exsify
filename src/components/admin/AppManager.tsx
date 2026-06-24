import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  Download,
  Check,
  X,
  Filter,
  MoreVertical,
  Download as DownloadIcon,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApps } from '../../hooks/useDatabase';
import type { App } from '../../types';
import { useToast } from '../../context/ToastContext';
import AddAppModal from '../ui/AddAppModal';
import EditAppModal from '../ui/EditAppModal';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';
import { exportUsersToCSV } from '../../utils/dbOperations';

export default function AppManager() {
  const { t } = useTranslation();
  const { apps, loading, create, update, remove } = useApps();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [deletingApp, setDeletingApp] = useState<App | null>(null);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = 
        app.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [apps, searchQuery, statusFilter]);

  const handleSelectAll = () => {
    if (selectedApps.length === filteredApps.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(filteredApps.map(app => app.id));
    }
  };

  const handleSelectApp = (appId: string) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(prev => prev.filter(id => id !== appId));
    } else {
      setSelectedApps(prev => [...prev, appId]);
    }
  };

  const handleToggleStatus = (app: App) => {
    const newStatus = app.status === 'active' ? 'inactive' : 'active';
    update(app.id, { status: newStatus });
    showToast(`App ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'success');
  };

  const handleToggleFeatured = (app: App) => {
    update(app.id, { featured: !app.featured });
    showToast(`App ${!app.featured ? 'added to' : 'removed from'} featured`, 'success');
  };

  const handleEdit = (app: App) => {
    setEditingApp(app);
    setIsEditModalOpen(true);
  };

  const handleView = (app: App) => {
    navigate(`/app/${app.slug}`);
  };

  const handleDelete = (app: App) => {
    setDeletingApp(app);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingApp) {
      remove(deletingApp.id);
      showToast('App deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setDeletingApp(null);
    }
  };

  const handleBulkToggleStatus = () => {
    selectedApps.forEach(id => {
      const app = apps.find(a => a.id === id);
      if (app) {
        handleToggleStatus(app);
      }
    });
    setSelectedApps([]);
  };

  const handleBulkDelete = () => {
    selectedApps.forEach(id => remove(id));
    showToast(`${selectedApps.length} apps deleted`, 'success');
    setSelectedApps([]);
  };

  const handleExport = () => {
    exportUsersToCSV();
    showToast('Data exported successfully', 'success');
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
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin.apps')}</h1>
          <p className="text-gray-300">Manage your software applications</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New App
        </button>
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
            placeholder="Search apps..."
            className="w-full pl-10 pr-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          >
            <option value="all" className="bg-[hsl(var(--exsify-dark))]">All Status</option>
            <option value="active" className="bg-[hsl(var(--exsify-dark))]">Active</option>
            <option value="inactive" className="bg-[hsl(var(--exsify-dark))]">Inactive</option>
          </select>
        </div>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 text-white rounded-lg hover:bg-[hsl(var(--exsify-dark-lighter))] transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedApps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-[hsl(var(--exsify-primary))]/10 border border-[hsl(var(--exsify-primary))]/30 rounded-lg"
        >
          <span className="text-white">{selectedApps.length} selected</span>
          <button
            onClick={handleBulkToggleStatus}
            className="px-3 py-1 text-sm bg-[hsl(var(--exsify-primary))] text-white rounded hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
          >
            Toggle Status
          </button>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </motion.div>
      )}

      {/* Table */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[hsl(var(--exsify-primary))]/20">
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedApps.length === filteredApps.length && filteredApps.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-[hsl(var(--exsify-primary))]/30 bg-white/5 text-[hsl(var(--exsify-primary))] focus:ring-[hsl(var(--exsify-primary))]"
                  />
                </th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">App</th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">Category</th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">Price</th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">Status</th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">Featured</th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">Stats</th>
                <th className="px-4 py-4 text-left text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-[hsl(var(--exsify-primary))]/10 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApps.includes(app.id)}
                      onChange={() => handleSelectApp(app.id)}
                      className="w-4 h-4 rounded border-[hsl(var(--exsify-primary))]/30 bg-white/5 text-[hsl(var(--exsify-primary))] focus:ring-[hsl(var(--exsify-primary))]"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.icon || app.screenshots[0]}
                        alt={app.name_en}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{app.name_en}</p>
                        <p className="text-gray-400 text-xs">{app.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-3 py-1 bg-[hsl(var(--exsify-primary))]/20 text-[hsl(var(--exsify-primary))] text-xs rounded-full">
                      {app.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white">${app.price_usd}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleStatus(app)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        app.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {app.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleToggleFeatured(app)}
                      className={`p-1 rounded transition-colors ${
                        app.featured
                          ? 'bg-[hsl(var(--exsify-accent))]/20 text-[hsl(var(--exsify-accent))]'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${app.featured ? 'fill-[hsl(var(--exsify-accent))]' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-300">
                        <Download className="w-4 h-4" />
                        {app.downloadCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-gray-300">
                        <Star className="w-4 h-4" />
                        {app.rating}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(app)}
                        className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="View App"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(app)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Edit App"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(app)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete App"
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

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No apps found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={create}
      />

      <EditAppModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingApp(null);
        }}
        onSave={update}
        app={editingApp}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingApp(null);
        }}
        onConfirm={confirmDelete}
        title="Delete App"
        message="Are you sure you want to delete this app? This action cannot be undone."
        itemName={deletingApp?.name_en}
      />
    </div>
  );
}
