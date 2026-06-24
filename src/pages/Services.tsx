import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List, Briefcase } from 'lucide-react';
import { useApps } from '../hooks/useDatabase';
import AppCard from '../components/ui/AppCard';

const categories = [
  'all',
  'Retail',
  'HR',
  'Inventory',
  'Finance',
  'Sales',
  'Education',
  'Healthcare',
  'Analytics'
];

export default function Services() {
  const { t, i18n } = useTranslation();
  const { apps, loading } = useApps();
  const isRTL = i18n.language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = 
        app.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      const isActive = app.status === 'active';
      
      return matchesSearch && matchesCategory && isActive;
    });
  }, [apps, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[hsl(var(--exsify-primary))] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E293B] mb-4">
            {t('apps.title')}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto mb-6">
            {t('apps.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-xl font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
          >
            <Briefcase className="w-5 h-5" />
            Request a Service
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[hsl(var(--exsify-primary))] text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-[#1E293B] hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? t('apps.categories.all') : category}
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[hsl(var(--exsify-primary))] text-white'
                  : 'text-gray-600 hover:text-[#1E293B]'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-[hsl(var(--exsify-primary))] text-white'
                  : 'text-gray-600 hover:text-[#1E293B]'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-500">
            Showing {filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Apps Grid */}
        {filteredApps.length > 0 ? (
          <div className={`grid ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          } gap-6`}>
            {filteredApps.map((app, index) => (
              <AppCard key={app.id} app={app} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] mb-2">No apps found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
