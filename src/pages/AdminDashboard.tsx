import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import AppManager from '../components/admin/AppManager';
import ConsultationManager from '../components/admin/ConsultationManager';
import ReviewManager from '../components/admin/ReviewManager';
import NewsManager from '../components/admin/NewsManager';
import UserManager from '../components/admin/UserManager';
import ThemeManager from '../components/admin/ThemeManager';
import MediaManager from '../components/admin/MediaManager';
import ContentEditor from '../components/admin/ContentEditor';
import CareerManager from '../components/admin/CareerManager';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/auth?mode=login');
      return;
    }
    if (user?.requiresPasswordChange) {
      navigate('/change-password');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, user]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--exsify-dark))]">
        <div className="animate-spin w-12 h-12 border-4 border-[hsl(var(--exsify-primary))] border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'apps':
        return <AppManager />;
      case 'consultations':
        return <ConsultationManager />;
      case 'reviews':
        return <ReviewManager />;
      case 'news':
        return <NewsManager />;
      case 'careers':
        return <CareerManager />;
      case 'users':
        return <UserManager />;
      case 'theme':
        return <ThemeManager />;
      case 'media':
        return <MediaManager />;
      case 'content':
        return <ContentEditor />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--exsify-dark))] flex">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Admin Header */}
        <div className="sticky top-0 z-10 bg-[hsl(var(--exsify-dark))]/95 backdrop-blur-md border-b border-[hsl(var(--exsify-primary))]/20 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-[hsl(var(--exsify-accent))]/20 rounded-lg flex items-center justify-center hidden sm:flex">
                <Shield className="w-5 h-5 text-[hsl(var(--exsify-accent))]" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg md:text-xl">{t('admin.title')}</h1>
                <p className="text-gray-300 text-sm hidden sm:block">Welcome, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
