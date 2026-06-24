import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Download, Star, Globe, Zap, Award, Shield, CheckCircle } from 'lucide-react';
import { useStats } from '../../hooks/useDatabase';
import { formatNumber } from '../../utils/currencyConverter';

const announcements = [
  { icon: CheckCircle, text: 'All 8 EXSIFY Apps Online & Mobile Optimized' },
  { icon: Zap, text: 'KaatibPOS v3.2 Deployed' },
  { icon: Globe, text: 'CargoFlow GPS Active' },
  { icon: Shield, text: 'M-Pesa Gateway Operational' },
  { icon: Award, text: '24/7 Support Available' },
  { icon: TrendingUp, text: '99.9% Uptime Guarantee' },
];

export default function SystemTicker() {
  const { t } = useTranslation();
  const { stats } = useStats();

  const tickerItems = [
    { icon: Download, label: t('hero.stats.downloads'), value: formatNumber(stats.totalDownloads || 15420) },
    { icon: Star, label: t('hero.stats.apps'), value: '8' },
    { icon: Users, label: t('hero.stats.countries'), value: '14+' },
    { icon: TrendingUp, label: t('hero.stats.satisfaction'), value: '96%' },
  ];

  // Duplicate for seamless loop
  const allAnnouncements = [...announcements, ...announcements];

  return (
    <>
      {/* Green Scrolling Announcement Bar - Screenshot Style */}
      <div className="bg-[hsl(var(--exsify-primary))] overflow-hidden">
        <div className="marquee-container py-2">
          <div className="marquee-track">
            {allAnnouncements.map((item, index) => (
              <div key={index} className="marquee-item flex items-center gap-2 px-4">
                <item.icon className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                <span className="text-white/90 text-xs font-medium whitespace-nowrap">{item.text}</span>
                <span className="text-white/40 mx-2">&#8226;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-8 py-2 px-4 flex-wrap">
            {tickerItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-[hsl(var(--exsify-primary))]" />
                <span className="text-[hsl(var(--exsify-primary))] font-bold text-sm">{item.value}</span>
                <span className="text-gray-500 text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-track {
          display: inline-flex;
          animation: marquee-scroll 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}
