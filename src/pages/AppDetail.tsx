import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Download,
  Check,
  Globe,
  Tag,
  ExternalLink,
  Share2,
  Heart,
  Play
} from 'lucide-react';
import type { App } from '../types';
import { useApps, useReviews } from '../hooks/useDatabase';
import { addDownload, isFavorite, toggleFavorite, hasUserDownloaded } from '../utils/dbOperations';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, formatNumber } from '../utils/currencyConverter';
import ReviewCard from '../components/ui/ReviewCard';
import StoreDownloadButtons from '../components/apps/StoreDownloadButtons';

export default function AppDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { apps } = useApps();
  const { reviews } = useReviews();
  const { currency } = useSettings();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'ar';
  const [selectedImage, setSelectedImage] = useState(0);

  const app = apps.find(a => a.slug === slug);

  const isInLibrary = isAuthenticated && user ? hasUserDownloaded(user.id, app?.id || '') : false;
  const [isLiked, setIsLiked] = useState(() =>
    isAuthenticated && user && app ? isFavorite(user.id, app.id) : false
  );

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-2">App Not Found</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6">The app you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
          >
            Browse All Apps
          </button>
        </div>
      </div>
    );
  }

  const name = isRTL ? app.name_ar : app.name_en;
  const description = isRTL ? app.description_ar : app.description_en;
  const features = isRTL ? app.features_ar : app.features_en;
  const formattedPrice = formatPrice(app.price_usd, currency);

  const appReviews = reviews.filter(
    r => r.appId === app.id && r.status === 'approved' && r.featured
  );
  const relatedApps = apps
    .filter(a => a.category === app.category && a.id !== app.id && a.status === 'active')
    .slice(0, 3);

  const handleDownload = () => {
    if (!isAuthenticated || !user) {
      showToast('Please sign in to download', 'error');
      navigate('/auth?mode=login');
      return;
    }
    try {
      addDownload(user.id, app.id);
      showToast('Download started! Check My Library.', 'success');
    } catch {
      showToast('Download failed. Please try again.', 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard', 'success');
  };

  const handleLike = () => {
    if (!isAuthenticated || !user) {
      showToast('Please sign in to favorite apps', 'error');
      navigate('/auth?mode=login');
      return;
    }
    if (!app) return;
    const next = toggleFavorite(user.id, app.id);
    setIsLiked(next);
    showToast(next ? 'Added to favorites' : 'Removed from favorites', 'success');
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[hsl(var(--exsify-primary))] dark:text-gray-400 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          {t('apps.backToApps')}
        </motion.button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden mb-4">
              <img
                src={app.screenshots[selectedImage]}
                alt={name}
                className="w-full aspect-video object-cover"
              />
              {app.featured && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-[hsl(var(--exsify-accent))] text-white font-bold rounded-full">
                  {t('apps.featured')}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {app.screenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-[hsl(var(--exsify-primary))]'
                      : 'border-transparent hover:border-[hsl(var(--exsify-primary))]/50'
                  }`}
                >
                  <img
                    src={screenshot}
                    alt={`${name} screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* App Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <img
                  src={app.icon || app.screenshots[0]}
                  alt={name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleLike}
                    className={`p-3 rounded-xl transition-colors ${
                      isLiked
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-[hsl(var(--exsify-primary))] dark:hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-[hsl(var(--exsify-primary))] dark:hover:text-white rounded-xl transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-[#1E293B] dark:text-white mb-2">{name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {app.category}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {app.regionsAvailable.length} countries
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-[hsl(var(--exsify-accent))]">{app.rating}</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(app.rating)
                          ? 'text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 border-l border-gray-200 dark:border-white/10 pl-4">
                <p className="text-gray-500 dark:text-gray-300 text-sm">{formatNumber(app.totalReviews)} reviews</p>
                <p className="text-gray-500 dark:text-gray-300 text-sm">{formatNumber(app.downloadCount)} downloads</p>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="p-6 bg-gradient-to-br from-[hsl(var(--exsify-primary))]/20 to-[hsl(var(--exsify-primary))]/5 rounded-xl border border-gray-200 dark:border-white/10">
              <p className="text-3xl font-bold text-[#1E293B] dark:text-white mb-4">
                {formattedPrice}
              </p>
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[hsl(var(--exsify-primary))] text-white rounded-xl font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
              >
                <Download className="w-5 h-5" />
                {isInLibrary ? t('apps.tryNow') : t('apps.download')}
              </button>
              {app.downloadUrl && (
                <a
                  href={app.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#1E293B] border-2 border-[hsl(var(--exsify-primary))] text-[hsl(var(--exsify-primary))] rounded-xl font-semibold hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Direct Download
                </a>
              )}
            </div>

            {/* Available Regions */}
            <div>
              <h3 className="text-[#1E293B] dark:text-white font-bold mb-3">Available In</h3>
              <div className="flex flex-wrap gap-2">
                {app.regionsAvailable.map(region => (
                  <span
                    key={region}
                    className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-sm rounded-full"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description & Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          <div>
            <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{description}</p>

            {/* YouTube video placeholder */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1E293B] dark:to-[#0B1120] border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center group hover:border-[hsl(var(--exsify-primary))]/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-[hsl(var(--exsify-primary))]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-[hsl(var(--exsify-primary))] ml-1" />
              </div>
              <p className="text-gray-500 dark:text-gray-300 font-medium">YouTube video placeholder</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Paste embed URL here</p>
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white">{t('apps.features')}</h2>
              <StoreDownloadButtons app={app} compact />
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(var(--exsify-primary))] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Reviews */}
        {appReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-6">
              {t('apps.reviews')} ({appReviews.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appReviews.slice(0, 6).map((review, index) => (
                <ReviewCard key={review.id} review={review} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Apps */}
        {relatedApps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#1E293B] dark:text-white mb-6">{t('apps.relatedApps')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedApps.map(relatedApp => {
                const relatedName = isRTL ? relatedApp.name_ar : relatedApp.name_en;
                const relatedPriceFormatted = formatPrice(relatedApp.price_usd, currency);

                return (
                  <Link
                    key={relatedApp.id}
                    to={`/app/${relatedApp.slug}`}
                    className="group bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 p-4 hover:border-[hsl(var(--exsify-primary))]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={relatedApp.screenshots[0]}
                        alt={relatedName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-[#1E293B] dark:text-white font-bold group-hover:text-[hsl(var(--exsify-primary))] transition-colors">
                          {relatedName}
                        </h3>
                        <p className="text-[hsl(var(--exsify-accent))] text-sm">
                          {relatedPriceFormatted}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-500 dark:text-gray-300 group-hover:text-[hsl(var(--exsify-primary))] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
