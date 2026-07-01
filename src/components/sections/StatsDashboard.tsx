import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Users, Globe, Star, TrendingUp } from 'lucide-react';
import { useStats } from '../../hooks/useDatabase';
import { seedRegionStats } from '../../utils/seedDatabase';
import { partnerCountries } from '../../utils/countryFlags';
import { formatNumber } from '../../utils/currencyConverter';
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
      value: partnerCountries.length,
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

  const activeMarkets = partnerCountries
    .map((country) => {
      const region = seedRegionStats.find((r) => r.country === country.name);
      return { ...country, users: region?.userCount || 0 };
    })
    .filter((country) => country.users > 0);

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--exsify-primary))]/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="section-title inline-block text-2xl sm:text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white mb-4">
            {t('stats.title')}{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] bg-clip-text text-transparent">
              {t('stats.titleHighlight')}
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            {t('stats.subtitle')}
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

        {/* Active Markets */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h3 className="section-title-left text-xl font-bold text-[#1E293B] dark:text-white mb-4">
            {t('stats.activeMarkets')}
          </h3>
          <div className="flex items-stretch gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {activeMarkets.map((country) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 snap-start w-36 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center hover:border-[hsl(var(--exsify-primary))]/40 hover:shadow-md transition-all"
              >
                <span className="text-3xl mb-2 block">{country.flag}</span>
                <p className="text-[#1E293B] dark:text-white text-sm font-semibold truncate">{country.name}</p>
                <p className="text-[hsl(var(--exsify-primary))] text-xs">
                  {formatNumber(country.users)} users
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
