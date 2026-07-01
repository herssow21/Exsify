import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';
import { useApps } from '../../hooks/useDatabase';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice } from '../../utils/currencyConverter';

export default function FeaturedAppsCarousel() {
  const { t, i18n } = useTranslation();
  const { apps } = useApps();
  const { currency } = useSettings();
  const isRTL = i18n.language === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  const featuredApps = apps.filter(app => app.featured && app.status === 'active');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white mb-4">
              {t('apps.title')}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 max-w-xl">
              {t('apps.subtitle')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[hsl(var(--exsify-primary))] hover:text-white hover:border-[hsl(var(--exsify-primary))] transition-all shadow-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[hsl(var(--exsify-primary))] hover:text-white hover:border-[hsl(var(--exsify-primary))] transition-all shadow-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredApps.map((app, index) => {
            const name = isRTL ? app.name_ar : app.name_en;
            const description = isRTL ? app.description_ar : app.description_en;
            const formattedPrice = formatPrice(app.price_usd, currency);

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[350px] snap-start"
              >
                <div className="group bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-[hsl(var(--exsify-primary))]/40 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={app.screenshots[0]}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[hsl(var(--exsify-accent))] text-[#1E293B] text-xs font-bold rounded-full">
                      {t('apps.featured')}
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-[hsl(var(--exsify-primary))]/90 backdrop-blur-sm text-white text-xs rounded-full">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-[#1E293B] dark:text-white font-bold text-xl line-clamp-1 group-hover:text-[hsl(var(--exsify-primary))] transition-colors">
                        {name}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]" />
                        <span className="text-[#1E293B] dark:text-white text-sm font-medium">{app.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                      {description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="text-[hsl(var(--exsify-primary))] font-bold text-lg">
                        {formattedPrice}
                      </div>
                      <Link
                        to={`/app/${app.slug}`}
                        className="group/btn flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))] text-white text-sm font-medium rounded-lg hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                      >
                        {t('apps.viewDetails')}
                        <ArrowRight className={`w-4 h-4 transition-transform group-hover/btn:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-[#1E293B] border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:border-[hsl(var(--exsify-primary))] hover:text-[hsl(var(--exsify-primary))] transition-all"
          >
            View All Solutions
            <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
