import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, WifiOff, HeadphonesIcon, Shield, Zap, Clock } from 'lucide-react';
import { partnerCountries } from '../../utils/countryFlags';
import { getKenyanMarketStats } from '../../utils/kenyanMarket';

const features = [
  {
    icon: Globe,
    titleKey: 'features.items.localized.title',
    descriptionKey: 'features.items.localized.description',
    color: 'from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary))]/50'
  },
  {
    icon: WifiOff,
    titleKey: 'features.items.offline.title',
    descriptionKey: 'features.items.offline.description',
    color: 'from-[hsl(var(--exsify-accent))] to-[hsl(var(--exsify-accent))]/50'
  },
  {
    icon: HeadphonesIcon,
    titleKey: 'features.items.support.title',
    descriptionKey: 'features.items.support.description',
    color: 'from-blue-500 to-blue-500/50'
  },
  {
    icon: Shield,
    titleKey: 'features.items.secure.title',
    descriptionKey: 'features.items.secure.description',
    color: 'from-green-500 to-green-500/50'
  },
  {
    icon: Zap,
    titleKey: 'features.items.fast.title',
    descriptionKey: 'features.items.fast.description',
    color: 'from-purple-500 to-purple-500/50'
  },
  {
    icon: Clock,
    titleKey: 'features.items.uptime.title',
    descriptionKey: 'features.items.uptime.description',
    color: 'from-pink-500 to-pink-500/50'
  }
];

export default function ValueProposition() {
  const { t } = useTranslation();
  const kenyanStats = getKenyanMarketStats();

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
            {t('features.title')}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-[hsl(var(--exsify-primary))]/40 hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`relative w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white group-hover:animate-pulse" />
                </div>

                {/* Content */}
                <h3 className="relative text-xl font-bold text-[#1E293B] mb-3 group-hover:text-[hsl(var(--exsify-primary))] transition-colors">
                  {t(feature.titleKey)}
                </h3>
                <p className="relative text-gray-500 text-sm leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Country marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <div className="text-center mb-6">
            <p className="text-[#1E293B] font-bold text-lg">{t('features.countryNote.title', { count: partnerCountries.length })}</p>
            <p className="text-gray-500 text-sm">{t('features.countryNote.subtitle')}</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white py-5">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
            <div className="marquee-track flex items-center gap-8">
              {[...partnerCountries, ...partnerCountries].map((country, i) => (
                <div
                  key={`${country.name}-${i}`}
                  className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 border border-gray-100 shadow-sm"
                  title={country.name}
                >
                  <span className="text-2xl leading-none">{country.flag}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Kenyan market */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <h3 className="section-title-left text-xl font-bold text-[#1E293B] mb-2">
            {t('features.kenyanMarket.title')}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {t('features.kenyanMarket.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            {kenyanStats.filter((county) => county.clients > 0).map((county) => (
              <div
                key={county.code}
                title={`${county.name} — ${county.clients} clients`}
                className="relative w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-[hsl(var(--exsify-primary))]/40 hover:shadow-md transition-all"
              >
                <span className="text-xs font-bold text-[#1E293B]">{county.code}</span>
                {county.clients > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-[hsl(var(--exsify-accent))] text-[#1E293B] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {county.clients}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .marquee-track {
          animation: marquee-scroll 30s linear infinite;
          width: max-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
