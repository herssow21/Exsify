import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  User, Mail, MapPin, DollarSign, Lock, Save, ArrowLeft,
  Eye, EyeOff, Shield, Calendar, Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { useDownloads } from '../hooks/useDatabase';
import type { CurrencyCode } from '../types';
import { kenyanCounties } from '../utils/kenyanMarket';
import { encodePassword, decodePassword } from '../utils/validators';
import { trpcClient } from '../utils/trpcVanilla';

const countries = [
  'Saudi Arabia', 'UAE', 'Egypt', 'Nigeria', 'Kenya',
  'South Africa', 'Qatar', 'Morocco', 'Tunisia', 'Algeria',
  'Jordan', 'Kuwait', 'Bahrain', 'Oman'
];

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'KES', name: 'Kenyan Shilling' }
];

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { currency, setCurrency } = useSettings();
  const { showToast } = useToast();
  const { downloads } = useDownloads();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    country: user?.country || 'Saudi Arabia',
    region: user?.region || '',
    currency: user?.currency || 'USD'
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
    }
  }, [isAuthenticated, navigate]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('exsify_users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.id === user?.id) {
          return { ...u, fullName: profileData.fullName, country: profileData.country, region: profileData.region, currency: profileData.currency };
        }
        return u;
      });
      localStorage.setItem('exsify_users', JSON.stringify(updatedUsers));

      // Update current user in session
      const currentUser = { ...user, fullName: profileData.fullName, country: profileData.country, region: profileData.region, currency: profileData.currency };
      localStorage.setItem('exsify_current_user', JSON.stringify(currentUser));

      // Update global currency setting
      setCurrency(profileData.currency as any);

      // Refresh auth context so navbar and UI updates immediately
      refreshUser();

      showToast('Profile updated successfully!', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    }

    setIsLoading(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('exsify_users') || '[]');
      const foundUser = users.find((u: any) => u.id === user?.id);
      const currentDecoded = foundUser ? decodePassword(foundUser.password) : '';

      if (!foundUser || currentDecoded !== passwordData.oldPassword) {
        showToast('Current password is incorrect', 'error');
        setIsLoading(false);
        return;
      }

      if (passwordData.newPassword === passwordData.oldPassword) {
        showToast('New password must be different from your current password', 'error');
        setIsLoading(false);
        return;
      }

      let updatedUser: any = null;
      const updatedUsers = users.map((u: any) => {
        if (u.id === user?.id) {
          updatedUser = { ...u, password: encodePassword(passwordData.newPassword), requiresPasswordChange: false };
          return updatedUser;
        }
        return u;
      });

      localStorage.setItem('exsify_users', JSON.stringify(updatedUsers));
      if (updatedUser) {
        localStorage.setItem('exsify_current_user', JSON.stringify(updatedUser));
      }
      refreshUser();
      trpcClient.localAuth.changePassword
        .mutate({ id: user?.id ?? '', password: passwordData.newPassword })
        .catch(() => {});
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully!', 'success');
    } catch {
      showToast('Failed to change password', 'error');
    }

    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B]">My Profile</h1>
          <p className="text-gray-500 mt-2">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: User Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-3xl">{user.fullName.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-[#1E293B]">{user.fullName}</h2>
              <p className="text-gray-500 text-sm mb-1">{user.email}</p>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[hsl(var(--exsify-primary))]/10 text-[hsl(var(--exsify-primary))] text-xs font-medium rounded-full mt-2">
                <Shield className="w-3 h-3" />
                {user.role === 'admin' ? 'Administrator' : 'Customer'}
              </span>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                  <span className="text-gray-600">{user.country}{user.region ? `, ${user.region}` : ''}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                  <span className="text-gray-600">{user.currency}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                  <span className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Library className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                  <span className="text-gray-600">{downloads.filter(d => d.userId === user.id).length} downloads</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Forms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-2"
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[hsl(var(--exsify-primary))] text-white'
                    : 'text-gray-500 hover:text-[#1E293B]'
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'password'
                    ? 'bg-[hsl(var(--exsify-primary))] text-white'
                    : 'text-gray-500 hover:text-[#1E293B]'
                }`}
              >
                Change Password
              </button>
            </div>

            {/* Profile Form */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">Personal Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={e => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={profileData.country}
                        onChange={e => setProfileData(prev => ({ ...prev, country: e.target.value, region: e.target.value === 'Kenya' ? prev.region : '' }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] focus:border-[hsl(var(--exsify-primary))] focus:outline-none appearance-none"
                      >
                        {countries.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={profileData.currency}
                        onChange={e => setProfileData(prev => ({ ...prev, currency: e.target.value as CurrencyCode }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] focus:border-[hsl(var(--exsify-primary))] focus:outline-none appearance-none"
                      >
                        {currencies.map(c => (
                          <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {profileData.country === 'Kenya' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">County / Region</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={profileData.region}
                        onChange={e => setProfileData(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] focus:border-[hsl(var(--exsify-primary))] focus:outline-none appearance-none"
                        required
                      >
                        <option value="">Select county</option>
                        {kenyanCounties.map(county => (
                          <option key={county.code} value={county.name}>{county.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Password Form */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-[#1E293B] mb-4">Change Password</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={passwordData.oldPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[hsl(var(--exsify-primary))]"
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[hsl(var(--exsify-primary))]"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="Repeat new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[hsl(var(--exsify-primary))]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50 mt-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
