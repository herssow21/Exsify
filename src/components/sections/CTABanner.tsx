import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { partnerCountries } from '../../utils/countryFlags';

export default function CTABanner() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--exsify-primary))]/20 via-[hsl(var(--exsify-accent))]/10 to-[hsl(var(--exsify-primary))]/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[hsl(var(--exsify-primary))]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[hsl(var(--exsify-accent))]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white rounded-3xl border border-gray-200 shadow-lg p-8 md:p-16 overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--exsify-primary))]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(var(--exsify-accent))]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="section-title text-3xl md:text-4xl lg:text-5xl font-bold text-[#1E293B] mb-6 leading-tight"
              >
                {t('cta.title')}{' '}
                <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] bg-clip-text text-transparent">
                  {t('cta.titleHighlight')}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-lg mb-8"
              >
                {t('cta.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/services"
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-[hsl(var(--exsify-primary))] text-white rounded-xl font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-all hover:shadow-lg hover:shadow-[hsl(var(--exsify-primary))]/20"
                >
                  {t('cta.ctaPrimary')}
                  <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[hsl(var(--exsify-primary))] hover:text-[hsl(var(--exsify-primary))] transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t('cta.ctaSecondary')}
                </Link>
              </motion.div>
            </div>

            {/* Right Content - Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-4xl font-bold text-[hsl(var(--exsify-accent))] mb-2">50K+</p>
                <p className="text-gray-500 text-sm">{t('cta.stats.activeUsers')}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-4xl font-bold text-[hsl(var(--exsify-primary))] mb-2">8</p>
                <p className="text-gray-500 text-sm">{t('cta.stats.softwareSolutions')}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">{partnerCountries.length}+</p>
                <p className="text-gray-500 text-sm">{t('cta.stats.countriesServed')}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <p className="text-4xl font-bold text-purple-600 mb-2">24/7</p>
                <p className="text-gray-500 text-sm">{t('cta.stats.supportAvailable')}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
