import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getUsers } from '../utils/dbOperations';
import { encodePassword, decodePassword } from '../utils/validators';
import { trpcClient } from '../utils/trpcVanilla';

const STORAGE_KEY = 'exsify_users';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

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
    if (!token) {
      showToast('Invalid or expired reset link', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const users = getUsers();
      const userIndex = users.findIndex(
        (u) =>
          u.passwordResetToken === token &&
          u.passwordResetExpires &&
          new Date(u.passwordResetExpires) > new Date()
      );

      if (userIndex === -1) {
        showToast('Invalid or expired reset link', 'error');
        setIsLoading(false);
        return;
      }

      const existingPassword = decodePassword(users[userIndex].password);
      if (password === existingPassword) {
        showToast('New password must be different from your previous password', 'error');
        setIsLoading(false);
        return;
      }

      users[userIndex] = {
        ...users[userIndex],
        password: encodePassword(password),
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        requiresPasswordChange: false
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

      trpcClient.localAuth.changePassword
        .mutate({ id: users[userIndex].id, password })
        .catch(() => {});

      showToast('Password reset successfully! Please sign in.', 'success');
      navigate('/auth?mode=login');
    } catch {
      showToast('Failed to reset password. Please try again.', 'error');
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
            <h2 className="text-2xl font-bold text-[#1E293B]">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your new password below.</p>
          </div>

          {!token ? (
            <div className="text-center py-4">
              <p className="text-red-500 mb-4">This reset link is invalid or has expired.</p>
              <Link
                to="/auth?mode=login"
                className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
              >
                Back to Login
              </Link>
            </div>
          ) : (
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
                    Reset Password
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
