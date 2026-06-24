import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, MapPin, Quote } from 'lucide-react';
import type { Review } from '../../types';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const comment = isRTL ? review.comment_ar : review.comment_en;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[hsl(var(--exsify-primary))]/40 transition-all duration-300"
    >
      {/* Quote Icon */}
      <Quote className={`w-8 h-8 text-[hsl(var(--exsify-primary))]/30 mb-4 ${isRTL ? 'rotate-180' : ''}`} />

      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
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
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-accent))] rounded-full flex items-center justify-center">
          <span className="text-[#1E293B] font-bold text-sm">
            {review.userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium text-sm">{review.userName}</h4>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{review.userCountry}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
