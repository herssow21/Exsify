import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getUsers } from '../utils/dbOperations';
import { encodePassword, decodePassword } from '../utils/validators';

const STORAGE_KEY = 'exsify_users';

export default function ChangePassword() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const users = getUsers();
      const userIndex = users.findIndex((u) => u.id === user?.id);

      if (userIndex === -1) {
        showToast('Session expired. Please sign in again.', 'error');
        logout();
        setIsLoading(false);
        return;
      }

      const existingPassword = decodePassword(users[userIndex].password);
      if (password === existingPassword) {
        showToast('New password must be different from your current password', 'error');
        setIsLoading(false);
        return;
      }

      const updatedUser = {
        ...users[userIndex],
        password: encodePassword(password),
        requiresPasswordChange: false,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      };

      users[userIndex] = updatedUser;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

      showToast('Password updated successfully! Please sign in with your new password.', 'success');
      logout();
      navigate('/auth?mode=login');
    } catch {
      showToast('Failed to update password. Please try again.', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B]">Change Password</h2>
            <p className="text-gray-500 text-sm mt-1">
              Your account requires a new password before you can continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-gray-500 text-sm">
              Rather sign out?{' '}
              <button
                type="button"
                onClick={logout}
                className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
              >
                Log out
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
