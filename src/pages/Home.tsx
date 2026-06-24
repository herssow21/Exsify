import React, { useEffect } from 'react';
import { seedDatabase } from '../utils/seedDatabase';
import HeroSection from '../components/sections/HeroSection';
import StatsDashboard from '../components/sections/StatsDashboard';
import FeaturedAppsCarousel from '../components/sections/FeaturedAppsCarousel';
import ReviewsGrid from '../components/sections/ReviewsGrid';
import ValueProposition from '../components/sections/ValueProposition';
import CTABanner from '../components/sections/CTABanner';

export default function Home() {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsDashboard />
      <FeaturedAppsCarousel />
      <ValueProposition />
      <ReviewsGrid />
      <CTABanner />
    </div>
  );
}
