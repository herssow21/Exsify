import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Download,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { useStats, useApps } from '../../hooks/useDatabase';
import { getDownloads, getUsers, getReviews, getConsultations } from '../../utils/dbOperations';
import { formatPrice } from '../../utils/currencyConverter';
import { useSettings } from '../../context/SettingsContext';
import { getKenyanMarketStats } from '../../utils/kenyanMarket';
import { getVisitsByDay } from '../../utils/dbOperations';

type DateFilter = 'today' | 'week' | 'month' | 'year' | 'all';

function isWithinDateFilter(dateString: string, filter: DateFilter): boolean {
  if (filter === 'all') return true;
  const date = new Date(dateString);
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  switch (filter) {
    case 'today':
      return date >= start;
    case 'week': {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      return date >= start;
    }
    case 'month':
      start.setDate(1);
      return date >= start;
    case 'year':
      start.setMonth(0, 1);
      return date >= start;
    default:
      return true;
  }
}

const filterOptions: { value: DateFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

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

function ChartCard({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
    >
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </motion.div>
  );
}

export default function AdminOverview() {
  const { t } = useTranslation();
  const { stats } = useStats();
  const { apps } = useApps();
  const { currency } = useSettings();
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const featuredApps = apps.filter(app => app.featured).length;
  const activeApps = apps.filter(app => app.status === 'active').length;

  const filteredDownloads = getDownloads().filter(d => isWithinDateFilter(d.downloadedAt, dateFilter));
  const filteredUsers = getUsers().filter(u => isWithinDateFilter(u.createdAt, dateFilter));
  const filteredPendingReviews = getReviews().filter(r => r.status === 'pending' && isWithinDateFilter(r.createdAt, dateFilter));
  const filteredNewConsultations = getConsultations().filter(c => c.status === 'new' && isWithinDateFilter(c.submittedAt, dateFilter));

  const filteredRevenue = filteredDownloads.reduce((acc, dl) => {
    const app = apps.find(a => a.id === dl.appId);
    return acc + (app ? app.price_usd : 0);
  }, 0);

  const statCards = [
    {
      title: t('admin.stats.totalDownloads'),
      value: filteredDownloads.length.toLocaleString(),
      icon: Download,
      trend: 12,
      color: 'bg-blue-500'
    },
    {
      title: dateFilter === 'all' ? t('admin.stats.activeUsers') : 'New Users',
      value: filteredUsers.length.toLocaleString(),
      icon: Users,
      trend: 8,
      color: 'bg-green-500'
    },
    {
      title: t('admin.stats.totalRevenue'),
      value: formatPrice(filteredRevenue, currency),
      icon: DollarSign,
      trend: 15,
      color: 'bg-[hsl(var(--exsify-accent))]'
    },
    {
      title: t('admin.stats.pendingReviews'),
      value: filteredPendingReviews.length,
      icon: Star,
      color: 'bg-purple-500'
    },
    {
      title: t('admin.stats.newConsultations'),
      value: filteredNewConsultations.length,
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

  // Country performance (registered users)
  const countryCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const user of filteredUsers) {
      counts.set(user.country, (counts.get(user.country) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([country, clients]) => ({ country, clients }))
      .sort((a, b) => b.clients - a.clients)
      .slice(0, 10);
  }, [filteredUsers]);

  // Kenyan counties performance
  const kenyanCounts = React.useMemo(() => {
    return getKenyanMarketStats(filteredUsers)
      .filter(c => c.clients > 0)
      .sort((a, b) => b.clients - a.clients);
  }, [filteredUsers]);

  // Site visitors filtered by the selected date range
  const visitorDays =
    dateFilter === 'today' ? 1 :
    dateFilter === 'week' ? 7 :
    dateFilter === 'month' ? 30 :
    dateFilter === 'year' ? 365 : 14;

  const visitorData = React.useMemo(() => {
    return getVisitsByDay(visitorDays);
  }, [dateFilter, visitorDays]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('admin.overview')}</h1>
          <p className="text-gray-300">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value as DateFilter)}
            className="px-4 py-2 bg-[hsl(var(--exsify-dark-lighter))] border border-[hsl(var(--exsify-primary))]/40 rounded-lg text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-[hsl(var(--exsify-dark))]">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Clients by Country" delay={0.6}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={countryCounts} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="country" stroke="#94a3b8" fontSize={10} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#f8c463' }}
              />
              <Bar dataKey="clients" fill="hsl(var(--exsify-accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={`Site Visitors (${dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'Last 7 Days' : dateFilter === 'month' ? 'Last 30 Days' : dateFilter === 'year' ? 'Last 365 Days' : 'Last 14 Days'})`} delay={0.7}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visitorData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => v.slice(5)} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#5aa88e' }}
              />
              <Line type="monotone" dataKey="visits" stroke="hsl(var(--exsify-primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {kenyanCounts.length > 0 && (
        <ChartCard title="Kenyan Counties Performance" delay={0.8}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kenyanCounts} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="code" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#f8c463' }}
                formatter={(value: any, _name: any, props: any) => [`${value} clients`, props?.payload?.name || 'County']}
              />
              <Bar dataKey="clients" fill="hsl(var(--exsify-accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Recent Activity & Top Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Apps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl border border-[hsl(var(--exsify-primary))]/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Top Performing Apps</h3>
          <div className="space-y-4">
            {apps
              .map(app => {
                const actualDownloads = filteredDownloads.filter(d => d.appId === app.id).length;
                return { app, actualDownloads };
              })
              .sort((a, b) => b.actualDownloads - a.actualDownloads || b.app.downloadCount - a.app.downloadCount)
              .slice(0, 5)
              .map(({ app, actualDownloads }, index) => (
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
                    <p className="text-gray-400 text-xs">{actualDownloads.toLocaleString()} downloads</p>
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
          transition={{ duration: 0.4, delay: 1 }}
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
