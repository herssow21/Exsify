import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Download, ExternalLink } from 'lucide-react';
import type { App } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { formatPrice, formatNumber } from '../../utils/currencyConverter';

interface AppCardProps {
  app: App;
  index?: number;
}

export default function AppCard({ app, index = 0 }: AppCardProps) {
  const { t, i18n } = useTranslation();
  const { currency } = useSettings();
  const isRTL = i18n.language === 'ar';

  const name = isRTL ? app.name_ar : app.name_en;
  const description = isRTL ? app.description_ar : app.description_en;
  const formattedPrice = formatPrice(app.price_usd, currency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[hsl(var(--exsify-primary))]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[hsl(var(--exsify-primary))]/10"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={app.screenshots[0]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--exsify-dark))] via-transparent to-transparent" />
        
        {/* Featured Badge */}
        {app.featured && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-[hsl(var(--exsify-accent))] text-white text-xs font-bold rounded-full">
            {t('apps.featured')}
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-[hsl(var(--exsify-primary))]/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {app.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-[#1E293B] font-bold text-lg line-clamp-1 group-hover:text-[hsl(var(--exsify-primary))] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="w-4 h-4 text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]" />
            <span className="text-white text-sm font-medium">{app.rating}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>{formatNumber(app.downloadCount)}</span>
            </div>
            <div className="text-[hsl(var(--exsify-accent))] font-bold">
              {formattedPrice}
            </div>
          </div>

          <Link
            to={`/app/${app.slug}`}
            className="flex items-center gap-1 px-4 py-2 bg-[hsl(var(--exsify-primary))] text-white text-sm font-medium rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
          >
            {t('apps.viewDetails')}
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
