import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApps } from '../../hooks/useDatabase';

export default function AppScreenshotsMarquee() {
  const { t, i18n } = useTranslation();
  const { apps } = useApps();
  const isRTL = i18n.language === 'ar';

  const customImage = t('content.showcaseImageUrl', '');
  const title = t('showcase.title', 'Our Solutions in Action');
  const subtitle = t('showcase.subtitle', 'One unified experience across desktop, tablet and mobile');

  const activeApps = apps.filter((app) => app.status === 'active' && app.screenshots?.length > 0);
  const hasCustomImage = Boolean(customImage && customImage.trim() !== '');
  const hasApps = activeApps.length > 0;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (hasCustomImage || activeApps.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeApps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [hasCustomImage, activeApps.length]);

  if (!hasCustomImage && !hasApps) return null;

  const currentApp = activeApps[current];
  const currentName = hasCustomImage ? title : isRTL ? currentApp?.name_ar : currentApp?.name_en;
  const image = hasCustomImage ? customImage : currentApp?.screenshots[0];

  const next = () => setCurrent((prev) => (prev + 1) % activeApps.length);
  const prev = () => setCurrent((prev) => (prev - 1 + activeApps.length) % activeApps.length);

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center min-h-[360px] sm:min-h-[460px]">
          {/* Device composition */}
          <div className="relative w-full max-w-4xl aspect-[16/9] sm:aspect-[16/8]">
            <AnimatePresence mode="wait">
              <motion.div
                key={hasCustomImage ? 'custom' : currentApp?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {/* Desktop Monitor */}
                <div className="absolute top-[5%] left-[5%] sm:left-[10%] w-[72%] sm:w-[65%] aspect-[16/10] z-10">
                  <div className="relative w-full h-full bg-gray-900 dark:bg-gray-800 rounded-xl sm:rounded-2xl border-4 sm:border-8 border-gray-900 dark:border-gray-700 shadow-2xl overflow-hidden">
                    <img
                      src={image}
                      alt={currentName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-700 dark:bg-gray-500 rounded-full" />
                  </div>
                  <div className="absolute -bottom-[8%] left-1/2 -translate-x-1/2 w-[12%] h-[8%] bg-gray-800 dark:bg-gray-700" />
                  <div className="absolute -bottom-[12%] left-1/2 -translate-x-1/2 w-[28%] h-[4%] bg-gray-800 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Tablet */}
                <div className="absolute top-[18%] right-[5%] sm:right-[10%] w-[22%] sm:w-[20%] aspect-[3/4] z-20">
                  <div className="relative w-full h-full bg-gray-900 dark:bg-gray-800 rounded-[1rem] sm:rounded-[1.5rem] border-4 sm:border-[6px] border-gray-900 dark:border-gray-700 shadow-xl overflow-hidden">
                    <img
                      src={image}
                      alt={currentName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gray-700 dark:bg-gray-500 rounded-full" />
                  </div>
                </div>

                {/* Smartphone */}
                <div className="absolute bottom-[5%] right-[18%] sm:right-[24%] w-[12%] sm:w-[11%] aspect-[9/19] z-30">
                  <div className="relative w-full h-full bg-gray-900 dark:bg-gray-800 rounded-[0.8rem] sm:rounded-[1.2rem] border-[3px] sm:border-4 border-gray-900 dark:border-gray-700 shadow-xl overflow-hidden">
                    <img
                      src={image}
                      alt={currentName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-[30%] h-[3%] bg-gray-900 dark:bg-gray-700 rounded-full" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows - only when rotating through apps */}
          {!hasCustomImage && activeApps.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous solution"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-white shadow hover:bg-white dark:hover:bg-gray-700 transition-colors z-40"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={next}
                aria-label="Next solution"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-white shadow hover:bg-white dark:hover:bg-gray-700 transition-colors z-40"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Name + dots */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={hasCustomImage ? 'custom' : currentApp?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))]/10 dark:bg-[hsl(var(--exsify-primary))]/20 border border-[hsl(var(--exsify-primary))]/20 rounded-full text-[hsl(var(--exsify-primary))] font-semibold text-sm"
            >
              {hasCustomImage ? title : currentApp?.category}
              {!hasCustomImage && <span className="w-1 h-1 rounded-full bg-[hsl(var(--exsify-primary))]" />}
              {currentName}
            </motion.span>
          </AnimatePresence>

          {!hasCustomImage && activeApps.length > 1 && (
            <div className="flex items-center gap-2">
              {activeApps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Show solution ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    idx === current
                      ? 'bg-[hsl(var(--exsify-primary))]'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
