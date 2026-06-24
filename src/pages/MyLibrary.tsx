import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Download, Star, ExternalLink, Package, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDownloads, useApps } from '../hooks/useDatabase';
import { useSettings } from '../context/SettingsContext';
import { convertPrice, formatPrice } from '../utils/currencyConverter';

export default function MyLibrary() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { downloads } = useDownloads();
  const { apps } = useApps();
  const { currency } = useSettings();
  const isRTL = i18n.language === 'ar';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Please Sign In</h2>
          <p className="text-gray-500 mb-6">Sign in to view your downloaded apps</p>
          <Link
            to="/auth?mode=login"
            className="px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const userDownloads = downloads.filter(d => d.userId === user?.id);
  const downloadedApps = apps.filter(app => 
    userDownloads.some(d => d.appId === app.id)
  );

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
            {t('nav.myLibrary')}
          </h1>
          <p className="text-gray-500">
            Welcome back, {user?.fullName}! Here are your downloaded apps.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-[hsl(var(--exsify-accent))]">{downloadedApps.length}</p>
            <p className="text-gray-400 text-sm">Downloaded Apps</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-[hsl(var(--exsify-primary))]">{user?.country}</p>
            <p className="text-gray-400 text-sm">Your Region</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-green-400">{user?.currency}</p>
            <p className="text-gray-400 text-sm">Currency</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-3xl font-bold text-purple-400">{user?.role}</p>
            <p className="text-gray-400 text-sm">Account Type</p>
          </div>
        </motion.div>

        {/* Downloaded Apps */}
        {downloadedApps.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloadedApps.map((app, index) => {
              const name = isRTL ? app.name_ar : app.name_en;
              const description = isRTL ? app.description_ar : app.description_en;
              const convertedPrice = convertPrice(app.price_usd, currency);
              const downloadDate = userDownloads.find(d => d.appId === app.id)?.downloadedAt;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-[hsl(var(--exsify-primary))]/50 transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={app.screenshots[0]}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--exsify-dark))] via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Downloaded
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-[#1E293B] font-bold line-clamp-1">{name}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-[hsl(var(--exsify-accent))] fill-[hsl(var(--exsify-accent))]" />
                        <span className="text-white text-sm">{app.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                      {description}
                    </p>

                    {downloadDate && (
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                        <Clock className="w-3 h-3" />
                        Downloaded on {new Date(downloadDate).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-[hsl(var(--exsify-accent))] font-bold">
                        {formatPrice(convertedPrice, currency)}
                      </span>
                      <Link
                        to={`/app/${app.slug}`}
                        className="flex items-center gap-1 px-4 py-2 bg-[hsl(var(--exsify-primary))] text-white text-sm rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
                      >
                        View Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-gray-200"
          >
            <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">No Downloads Yet</h3>
            <p className="text-gray-500 mb-6">Start exploring our software solutions</p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg hover:bg-[hsl(var(--exsify-primary))]/80 transition-colors"
            >
              Browse Apps
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
