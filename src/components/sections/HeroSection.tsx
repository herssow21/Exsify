import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Sparkles, Briefcase } from 'lucide-react';
import { partnerCountries } from '../../utils/countryFlags';

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const heroCountries = partnerCountries;

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#EDF5F1]">
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
            className="text-start lg:text-start"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--exsify-primary))]/10 border border-gray-200 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
              <span className="text-[hsl(var(--exsify-primary))] text-sm font-semibold">
                Enterprise Software. African Innovation. Global Scale.
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E293B] mb-6 leading-[1.1] sm:leading-tight tracking-tight"
            >
              {t('hero.title') || 'Enterprise Software.'}<br />
              <span className="text-[#1E293B]">African Innovation.</span><br />
              <span className="bg-gradient-to-r from-[hsl(var(--exsify-accent))] to-[hsl(var(--exsify-accent-dark))] bg-clip-text text-transparent">
                Global Scale.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl mx-0 lg:mx-0"
            >
              Trusted by businesses across Africa and the Middle East
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
                    className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full text-xl shadow-sm flex-shrink-0"
                  >
                    {country.flag}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-2 text-start lg:text-start">
                Proudly serving {heroCountries.length}+ countries across Africa & the Middle East
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-start lg:justify-start"
            >
              <Link
                to="/services"
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[hsl(var(--exsify-primary))] text-white rounded-xl font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-all hover:shadow-lg hover:shadow-[hsl(var(--exsify-primary))]/20"
              >
                Explore Solutions
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/contact"
                className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white border-2 border-[hsl(var(--exsify-primary))] text-[hsl(var(--exsify-primary))] rounded-xl font-semibold hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-all"
              >
                <Briefcase className="w-5 h-5" />
                Request a Service
              </Link>
            </motion.div>

            {/* Star Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-8 justify-start lg:justify-start"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--exsify-accent))] text-[hsl(var(--exsify-accent))]" />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                <span className="font-bold text-[#1E293B]">4.9/5</span> from <span className="font-bold text-[#1E293B]">500+</span> Verified Reviews
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
                {/* Front Face */}
                <div className="box-face box-front">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">EX</span>
                    </div>
                    <p className="text-[#1E293B] font-bold text-sm">EXSIFY</p>
                    <p className="text-gray-500 text-xs">Software Suite</p>
                  </div>
                </div>
                {/* Back Face */}
                <div className="box-face box-back">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--exsify-accent))] to-[hsl(var(--exsify-accent-dark))] flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl font-bold">CF</span>
                    </div>
                    <p className="text-[#1E293B] font-bold text-sm">CarGoFlow</p>
                    <p className="text-gray-500 text-xs">Vehicle and Property Tracking</p>
                  </div>
                </div>
                {/* Right Face */}
                <div className="box-face box-right">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl font-bold">POS</span>
                    </div>
                    <p className="text-[#1E293B] font-bold text-sm">Exsify POS</p>
                    <p className="text-gray-500 text-xs">Retail Management</p>
                  </div>
                </div>
                {/* Left Face */}
                <div className="box-face box-left">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--exsify-dark))] to-[hsl(var(--exsify-primary-dark))] flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl font-bold">ExB</span>
                    </div>
                    <p className="text-[#1E293B] font-bold text-sm">ExBuy</p>
                    <p className="text-gray-500 text-xs">E-Market</p>
                  </div>
                </div>
                {/* Top Face */}
                <div className="box-face box-top">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[hsl(var(--exsify-primary))]/20 flex items-center justify-center mb-2">
                        <Sparkles className="w-6 h-6 text-[hsl(var(--exsify-primary))]" />
                      </div>
                      <p className="text-[hsl(var(--exsify-primary))] text-xs font-bold">EXSIFY</p>
                    </div>
                  </div>
                </div>
                {/* Bottom Face */}
                <div className="box-face box-bottom">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-[hsl(var(--exsify-primary))]/70 text-xs font-bold tracking-widest">SOFTWARES</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Download Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-10"
            >
              <div className="text-center">
                <p className="text-[hsl(var(--exsify-primary))] text-2xl font-bold">15K+</p>
                <p className="text-gray-500 text-xs">Downloads</p>
              </div>
            </motion.div>

            {/* Floating New User Badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 left-4 bg-white backdrop-blur-xl p-4 rounded-xl shadow-xl border border-gray-100 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg font-bold">+</span>
                </div>
                <div>
                  <p className="text-[#1E293B] font-bold text-sm">New User</p>
                  <p className="text-gray-500 text-xs">Just joined from UAE</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
