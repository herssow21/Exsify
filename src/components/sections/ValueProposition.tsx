import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, WifiOff, HeadphonesIcon, Shield, Zap, Clock } from 'lucide-react';
import { partnerCountries } from '../../utils/countryFlags';

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
    descriptionKey: 'Lightning-fast performance optimized for regional infrastructure',
    color: 'from-purple-500 to-purple-500/50'
  },
  {
    icon: Clock,
    titleKey: 'features.items.uptime.title',
    descriptionKey: '99.9% uptime guarantee with redundant infrastructure',
    color: 'from-pink-500 to-pink-500/50'
  }
];

export default function ValueProposition() {
  const { t } = useTranslation();

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
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
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
            <p className="text-[#1E293B] font-bold text-lg">Trusted across {partnerCountries.length}+ countries</p>
            <p className="text-gray-500 text-sm">Join businesses scaling across Africa & the Middle East</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white py-4">
            <div className="marquee-track flex items-center gap-6">
              {[...partnerCountries, ...partnerCountries].map((country, i) => (
                <div
                  key={`${country.name}-${i}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap"
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-sm font-medium text-[#1E293B]">{country.name}</span>
                </div>
              ))}
            </div>
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
