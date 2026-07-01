import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useReviews } from '../../hooks/useDatabase';
import { useApps } from '../../hooks/useDatabase';

export default function ReviewsGrid() {
  const { t, i18n } = useTranslation();
  const { reviews } = useReviews();
  const { apps } = useApps();
  const isRTL = i18n.language === 'ar';

  const approvedReviews = reviews
    .filter(r => r.status === 'approved' && r.featured)
    .slice(0, 6);

  const getAppName = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app ? (isRTL ? app.name_ar : app.name_en) : '';
  };

  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--exsify-accent))]/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] dark:text-white mb-4">
            What Our{' '}
            <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
            Trusted by thousands of businesses across Africa and the Middle East
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedReviews.map((review, index) => {
            const comment = isRTL ? review.text_ar : review.text_en;
            
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-white/10 p-6 hover:border-[hsl(var(--exsify-primary))]/40 hover:shadow-md transition-all duration-300"
              >
                {/* Quote Icon */}
                <Quote className={`w-10 h-10 text-[hsl(var(--exsify-primary))]/30 mb-4 ${isRTL ? 'rotate-180' : ''}`} />

                {/* Review Text */}
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                  "{comment}"
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] rounded-full flex items-center justify-center">
                    <span className="text-[#1E293B] font-bold text-lg">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[#1E293B] dark:text-white font-medium">{review.userName}</h4>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">{review.userCountry}</p>
                  </div>
                </div>

                {/* App Name */}
                <div className="mt-4 pt-4 border-t border-[hsl(var(--exsify-primary))]/10">
                  <span className="text-[hsl(var(--exsify-primary))] text-xs">
                    Using: {getAppName(review.appId || '')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-[#1E293B] dark:text-white">4.7</p>
            <div className="flex items-center gap-1 justify-center my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]" />
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Average Rating</p>
          </div>
          <div className="w-px h-16 bg-[hsl(var(--exsify-primary))]/20 hidden md:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#1E293B] dark:text-white">1,400+</p>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Reviews</p>
          </div>
          <div className="w-px h-16 bg-[hsl(var(--exsify-primary))]/20 hidden md:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-[#1E293B] dark:text-white">96%</p>
            <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Would Recommend</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
