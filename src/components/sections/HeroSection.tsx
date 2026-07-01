import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Briefcase } from 'lucide-react';
import { partnerCountries } from '../../utils/countryFlags';
import ThemeToggle from '../ui/ThemeToggle';

const cubeSides = ['front', 'back', 'right', 'left', 'top', 'bottom'] as const;

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const heroCountries = partnerCountries;

  const [newUserCountry, setNewUserCountry] = useState(() =>
    partnerCountries[Math.floor(Math.random() * partnerCountries.length)]
  );

  useEffect(() => {
    const pickRandomCountry = () =>
      setNewUserCountry(partnerCountries[Math.floor(Math.random() * partnerCountries.length)]);

    pickRandomCountry();
    const interval = setInterval(pickRandomCountry, 20 * 60 * 1000); // every 20 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EDF5F1] dark:from-[#0B1120] dark:via-[#0B1120] dark:to-[#0F172A]">
      {/* Subtle background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[hsl(var(--exsify-primary))]/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[hsl(var(--exsify-primary))]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[hsl(var(--exsify-accent))]/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-start lg:text-start mr-3 sm:mr-0"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))]/10 border border-gray-200 dark:border-white/10 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
              <span className="text-[hsl(var(--exsify-primary))] text-sm font-semibold">
                {t('hero.badge')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E293B] dark:text-white mb-6 leading-[1.1] sm:leading-tight tracking-tight"
            >
              {t('hero.title')}<br />
              <span className="text-[#1E293B] dark:text-white">{t('hero.headline.line2')}</span><br />
              <span className="bg-gradient-to-r from-[hsl(var(--exsify-accent))] to-[hsl(var(--exsify-accent-dark))] bg-clip-text text-transparent">
                {t('hero.headline.line3')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-0 lg:mx-0"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* Country flags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {heroCountries.map((country) => (
                  <span
                    key={country.name}
                    title={country.name}
                    className="inline-flex items-center justify-center w-10 h-10 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-white/10 rounded-full text-xl shadow-sm flex-shrink-0"
                  >
                    {country.flag}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 text-start lg:text-start">
                {t('hero.countryNote', { count: heroCountries.length })}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 justify-center sm:justify-start"
            >
              <Link
                to="/services"
                className="group flex items-center justify-center gap-2 w-full max-w-sm sm:w-auto sm:max-w-none mx-auto sm:mx-0 px-8 py-4 bg-[hsl(var(--exsify-primary))] text-white rounded-xl font-semibold text-center hover:bg-[hsl(var(--exsify-primary-dark))] transition-all hover:shadow-lg hover:shadow-[hsl(var(--exsify-primary))]/20"
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/contact?form=consultation"
                className="group flex items-center justify-center gap-2 w-full max-w-sm sm:w-auto sm:max-w-none mx-auto sm:mx-0 px-8 py-4 bg-white dark:bg-[#1E293B] border-2 border-[hsl(var(--exsify-primary))] text-[hsl(var(--exsify-primary))] rounded-xl font-semibold text-center hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-all"
              >
                <Briefcase className="w-5 h-5" />
                {t('hero.ctaSecondary')}
              </Link>
            </motion.div>

            {/* Star Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 mt-8 justify-center sm:justify-start"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--exsify-accent))] text-[hsl(var(--exsify-accent))]" />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-300 text-sm text-center sm:text-start">
                <span className="font-bold text-[#1E293B] dark:text-white">4.9/5</span> {t('hero.rating.from')} <span className="font-bold text-[#1E293B] dark:text-white">500+</span> {t('hero.rating.reviews')}
              </span>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Rotating Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="scene">
              <div className="rotating-box">
                {cubeSides.map((side) => (
                  <div key={side} className={`box-face box-${side}`}>
                    <div className="cube-face-content">
                      <div className="cube-badge">
                        {t(`cube.faces.${side}.badge`)}
                      </div>
                      <h3>{t(`cube.faces.${side}.title`)}</h3>
                      <p>{t(`cube.faces.${side}.subtitle`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Download Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 right-4 bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-10"
            >
              <div className="text-center">
                <p className="text-[hsl(var(--exsify-primary))] text-2xl font-bold">{t('hero.badges.downloads.value')}</p>
                <p className="text-gray-500 dark:text-gray-300 text-xs">{t('hero.badges.downloads.label')}</p>
              </div>
            </motion.div>

            {/* Floating New User Badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 left-4 bg-white dark:bg-[#1E293B] backdrop-blur-xl p-4 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg font-bold">+</span>
                </div>
                <div>
                  <p className="text-[#1E293B] dark:text-white font-bold text-sm">{t('hero.badges.newUser.title')}</p>
                  <p className="text-gray-500 dark:text-gray-300 text-xs">{t('hero.badges.newUser.subtitle', { country: newUserCountry.name })}</p>
                </div>
              </div>
            </motion.div>

            {/* Theme Toggle - bottom right intersection */}
            <div className="absolute bottom-0 right-0 translate-x-4 translate-y-4 z-20">
              <ThemeToggle />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
