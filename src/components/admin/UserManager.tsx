import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, User, Mail, MapPin, Calendar,
  Search, Edit3, Trash2, Eye, X, Check, Lock
} from 'lucide-react';
import { useUsers } from '../../hooks/useDatabase';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import type { User as UserType } from '../../types';
import DeleteConfirmModal from '../ui/DeleteConfirmModal';

export default function UserManager() {
  const { users, loading, update, remove } = useUsers();
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // View modal state
  const [viewingUser, setViewingUser] = useState<UserType | null>(null);

  // Edit role state
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'customer'>('customer');

  // Delete state
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleForcePasswordChange = (targetUser: UserType) => {
    if (targetUser.id === currentUser?.id) {
      showToast('You cannot force a password change on your own account', 'error');
      return;
    }
    update(targetUser.id, { requiresPasswordChange: true });
    showToast(`${targetUser.fullName} will be required to change their password on next login`, 'success');
  };

  const handleRoleSave = () => {
    if (!editingUser) return;

    const otherAdmin = users.find(u => u.role === 'admin' && u.id !== editingUser.id);

    if (newRole === 'admin' && otherAdmin) {
      showToast('Only one system admin is allowed. Demote the existing admin first.', 'error');
      return;
    }

    if (editingUser.role === 'admin' && newRole === 'customer' && !otherAdmin) {
      showToast('You must keep at least one admin account.', 'error');
      return;
    }

    update(editingUser.id, { role: newRole });
    showToast(`Role updated to ${newRole}`, 'success');
    setEditingUser(null);
  };

  const handleDelete = () => {
    if (deletingUser) {
      if (deletingUser.id === currentUser?.id) {
        showToast('You cannot delete your own account', 'error');
        setDeletingUser(null);
        return;
      }
      remove(deletingUser.id);
      showToast('User deleted successfully', 'success');
      setDeletingUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--exsify-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Users</h1>
          <p className="text-gray-300">
            Manage system users — {users.length} total
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--exsify-primary)]/20 text-[var(--exsify-primary)] rounded-lg text-sm">
          <Shield className="w-4 h-4" />
          {users.filter(u => u.role === 'admin').length} Admin(s)
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or country..."
          className="w-full pl-10 pr-4 py-3 bg-[var(--exsify-dark-lighter)] border border-[var(--exsify-primary)]/30 rounded-lg text-white placeholder-gray-500 focus:border-[var(--exsify-primary)] focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--exsify-primary)]/20">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 hidden md:table-cell">Email</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 hidden sm:table-cell">Country</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 hidden lg:table-cell">Joined</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, index) => (
              <motion.tr
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--exsify-primary)] to-[var(--exsify-primary-dark)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {u.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{u.fullName}</p>
                      <p className="text-gray-400 text-xs md:hidden">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm hidden md:table-cell">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.role === 'admin'
                      ? 'bg-[var(--exsify-accent)]/20 text-[var(--exsify-accent)]'
                      : 'bg-white/10 text-gray-300'
                  }`}>
                    {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300 text-sm hidden sm:table-cell">{u.country}</td>
                <td className="py-3 px-4 text-gray-400 text-sm hidden lg:table-cell">{formatDate(u.createdAt)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {u.requiresPasswordChange && (
                      <span className="mr-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                        <Lock className="w-3 h-3" />
                        Must change password
                      </span>
                    )}
                    <button
                      onClick={() => setViewingUser(u)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setEditingUser(u); setNewRole(u.role as 'admin' | 'customer'); }}
                      className="p-2 text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                      title="Edit role"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleForcePasswordChange(u)}
                      className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      title="Force password change on next login"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingUser(u)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">No users found</div>
      )}

      {/* ============ VIEW USER MODAL ============ */}
      <AnimatePresence>
        {viewingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--exsify-dark)] rounded-xl border border-[var(--exsify-primary)]/20 p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <button onClick={() => setViewingUser(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--exsify-primary)] to-[var(--exsify-primary-dark)] flex items-center justify-center text-white font-bold text-2xl">
                  {viewingUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{viewingUser.fullName}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    viewingUser.role === 'admin' ? 'bg-[var(--exsify-accent)]/20 text-[var(--exsify-accent)]' : 'bg-white/10 text-gray-300'
                  }`}>
                    {viewingUser.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {viewingUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[var(--exsify-primary)]" />
                  <span className="text-gray-300">{viewingUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[var(--exsify-primary)]" />
                  <span className="text-gray-300">{viewingUser.country}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-[var(--exsify-primary)]" />
                  <span className="text-gray-300">ID: {viewingUser.id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-[var(--exsify-primary)]" />
                  <span className="text-gray-300">Joined: {formatDate(viewingUser.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ EDIT ROLE MODAL ============ */}
      <AnimatePresence>
        {editingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--exsify-dark)] rounded-xl border border-[var(--exsify-primary)]/20 p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Edit User Role</h3>
                <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-300 text-sm mb-4">
                Change role for <span className="text-white font-medium">{editingUser.fullName}</span>
              </p>

              <div className="space-y-2 mb-6">
                <button
                  onClick={() => setNewRole('admin')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                    newRole === 'admin'
                      ? 'border-[var(--exsify-accent)] bg-[var(--exsify-accent)]/10 text-[var(--exsify-accent)]'
                      : 'border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Administrator
                  </span>
                  {newRole === 'admin' && <Check className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setNewRole('customer')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                    newRole === 'customer'
                      ? 'border-[var(--exsify-primary)] bg-[var(--exsify-primary)]/10 text-[var(--exsify-primary)]'
                      : 'border-white/10 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Customer
                  </span>
                  {newRole === 'customer' && <Check className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleRoleSave}
                  className="flex items-center gap-2 px-5 py-2 bg-[var(--exsify-primary)] text-white rounded-lg hover:bg-[var(--exsify-primary-dark)] transition-colors font-semibold"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ DELETE CONFIRM MODAL ============ */}
      <DeleteConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="This will permanently remove the user account. Their data cannot be recovered."
        itemName={deletingUser?.fullName}
      />
    </div>
  );
}
