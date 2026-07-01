import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  AppWindow,
  MessageSquare,
  Star,
  Newspaper,
  Users,
  ChevronLeft,
  X,
  Palette,
  FolderOpen,
  FileText,
  Briefcase,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ activeTab, onTabChange, mobileOpen, onMobileClose }: AdminSidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'overview', label: t('admin.overview'), icon: LayoutDashboard },
    { id: 'apps', label: t('admin.apps'), icon: AppWindow },
    { id: 'consultations', label: t('admin.consultations'), icon: MessageSquare },
    { id: 'reviews', label: t('admin.reviews'), icon: Star },
    { id: 'news', label: t('admin.news'), icon: Newspaper },
    { id: 'careers', label: 'Careers', icon: Briefcase },
    { id: 'users', label: t('admin.users'), icon: Users },
    { id: 'media', label: 'Media', icon: FolderOpen },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'theme', label: 'Theme', icon: Palette },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-64 bg-[hsl(var(--exsify-dark))] border-r border-[hsl(var(--exsify-primary))]/20 flex-shrink-0 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 flex-1">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/Exfy_Logo.png" alt="EXSIFY" className="w-10 h-10 object-contain" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">{t('app.name')}</span>
              <span className="text-[hsl(var(--exsify-accent))] font-bold text-xl tracking-tight">SOFTWARE</span>
            </Link>
            <button 
              onClick={onMobileClose}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onMobileClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-[hsl(var(--exsify-primary))] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Back to Website */}
        <div className="p-6 border-t border-[hsl(var(--exsify-primary))]/20">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
}
