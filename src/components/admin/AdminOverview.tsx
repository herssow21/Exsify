import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Download,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useStats, useApps } from '../../hooks/useDatabase';
import { formatPrice } from '../../utils/currencyConverter';
import { useSettings } from '../../context/SettingsContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  color: string;
  index: number;
}

function StatCard({ title, value, icon: Icon, trend, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6 hover:border-[hsl(var(--exsify-primary))]/40 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-300 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminOverview() {
  const { t } = useTranslation();
  const { stats } = useStats();
  const { apps } = useApps();
  const { currency } = useSettings();

  const featuredApps = apps.filter(app => app.featured).length;
  const activeApps = apps.filter(app => app.status === 'active').length;

  const statCards = [
    {
      title: t('admin.stats.totalDownloads'),
      value: stats.totalDownloads.toLocaleString(),
      icon: Download,
      trend: 12,
      color: 'bg-blue-500'
    },
    {
      title: t('admin.stats.activeUsers'),
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      trend: 8,
      color: 'bg-green-500'
    },
    {
      title: t('admin.stats.totalRevenue'),
      value: formatPrice(stats.totalRevenue, currency),
      icon: DollarSign,
      trend: 15,
      color: 'bg-[hsl(var(--exsify-accent))]'
    },
    {
      title: t('admin.stats.pendingReviews'),
      value: stats.pendingReviews,
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: t('admin.stats.newConsultations'),
      value: stats.newConsultations,
      icon: MessageSquare,
      color: 'bg-pink-500'
    },
    {
      title: 'Active Apps',
      value: `${activeApps}/${apps.length}`,
      icon: Download,
      color: 'bg-[hsl(var(--exsify-primary))]'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('admin.overview')}</h1>
        <p className="text-gray-300">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Recent Activity & Top Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Apps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Top Performing Apps</h3>
          <div className="space-y-4">
            {apps
              .sort((a, b) => b.downloadCount - a.downloadCount)
              .slice(0, 5)
              .map((app, index) => (
                <div key={app.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[hsl(var(--exsify-primary))]/20 rounded-lg flex items-center justify-center text-[hsl(var(--exsify-accent))] font-bold text-sm">
                    {index + 1}
                  </div>
                  <img
                    src={app.icon || app.screenshots[0]}
                    alt={app.name_en}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{app.name_en}</p>
                    <p className="text-gray-400 text-xs">{app.downloadCount.toLocaleString()} downloads</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]" />
                    <span className="text-white text-sm">{app.rating}</span>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Platform Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[hsl(var(--exsify-primary))]/20">
              <span className="text-gray-300">Total Apps</span>
              <span className="text-white font-medium">{apps.length}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[hsl(var(--exsify-primary))]/20">
              <span className="text-gray-300">Featured Apps</span>
              <span className="text-white font-medium">{featuredApps}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[hsl(var(--exsify-primary))]/20">
              <span className="text-gray-300">Active Apps</span>
              <span className="text-white font-medium">{activeApps}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[hsl(var(--exsify-primary))]/20">
              <span className="text-gray-300">Inactive Apps</span>
              <span className="text-white font-medium">{apps.length - activeApps}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-300">Average Rating</span>
              <span className="text-white font-medium">
                {(apps.reduce((acc, app) => acc + app.rating, 0) / apps.length).toFixed(1)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
