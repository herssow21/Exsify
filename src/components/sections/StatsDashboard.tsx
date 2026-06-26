import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Users, Globe, Star, TrendingUp } from 'lucide-react';
import { useStats } from '../../hooks/useDatabase';
import StatCounter from '../ui/StatCounter';

export default function StatsDashboard() {
  const { t } = useTranslation();
  const { stats } = useStats();

  const platformStats = [
    {
      value: stats.totalDownloads,
      suffix: '+',
      label: t('hero.stats.downloads'),
      icon: Download,
      color: 'bg-blue-500'
    },
    {
      value: stats.totalApps || 8,
      suffix: '',
      label: t('hero.stats.apps'),
      icon: TrendingUp,
      color: 'bg-[hsl(var(--exsify-accent))]'
    },
    {
      value: 14,
      suffix: '+',
      label: t('hero.stats.countries'),
      icon: Globe,
      color: 'bg-green-500'
    },
    {
      value: 96,
      suffix: '%',
      label: t('hero.stats.satisfaction'),
      icon: Star,
      color: 'bg-purple-500'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--exsify-primary))]/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
            Trusted by Businesses Across{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] bg-clip-text text-transparent">
              Africa & Middle East
            </span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Join thousands of businesses that have transformed their operations with EXSIFY solutions
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {platformStats.map((stat, index) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              color={stat.color}
              index={index}
            />
          ))}
        </div>

        {/* Regional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {[
            { country: 'Saudi Arabia', flag: '🇸🇦', users: '3,200' },
            { country: 'UAE', flag: '🇦🇪', users: '2,800' },
            { country: 'Nigeria', flag: '🇳🇬', users: '3,100' },
            { country: 'Kenya', flag: '🇰🇪', users: '2,400' },
            { country: 'Egypt', flag: '🇪🇬', users: '2,100' },
            { country: 'South Africa', flag: '🇿🇦', users: '1,800' },
          ].map((region, index) => (
            <motion.div
              key={region.country}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-[hsl(var(--exsify-primary))]/40 hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-2 block">{region.flag}</span>
              <p className="text-[#1E293B] text-sm font-medium">{region.country}</p>
              <p className="text-[hsl(var(--exsify-primary))] text-xs">{region.users} users</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
