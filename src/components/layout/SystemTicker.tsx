import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, Download, Star, Globe, Zap, Award, Shield, CheckCircle } from 'lucide-react';
import { useStats } from '../../hooks/useDatabase';
import { formatNumber } from '../../utils/currencyConverter';
import { partnerCountries } from '../../utils/countryFlags';

const announcementIcons = [CheckCircle, Zap, Globe, Shield, Award, TrendingUp];

export default function SystemTicker() {
  const { t } = useTranslation();
  const { stats } = useStats();

  const tickerItems = [
    { icon: Download, label: t('hero.stats.downloads'), value: formatNumber(stats.totalDownloads || 0) },
    { icon: Star, label: t('hero.stats.apps'), value: stats.totalApps || 8 },
    { icon: Users, label: t('hero.stats.countries'), value: `${partnerCountries.length}+` },
    { icon: TrendingUp, label: t('hero.stats.satisfaction'), value: '96%' },
  ];

  // Duplicate for seamless loop
  const allAnnouncementIcons = [...announcementIcons, ...announcementIcons];

  return (
    <>
      {/* Green Scrolling Announcement Bar - Screenshot Style */}
      <div className="bg-[hsl(var(--exsify-primary))] overflow-hidden">
        <div className="marquee-container py-2">
          <div className="marquee-track">
            {allAnnouncementIcons.map((Icon, index) => (
              <div key={index} className="marquee-item flex items-center gap-2 px-4">
                <Icon className="w-3.5 h-3.5 text-white/90 flex-shrink-0" />
                <span className="text-white/90 text-xs font-medium whitespace-nowrap">{t(`announcements.item${index % announcementIcons.length}`)}</span>
                <span className="text-white/40 mx-2">&#8226;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[hsl(var(--exsify-dark))] border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 px-4">
            {tickerItems.map((item, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <item.icon className="w-4 h-4 text-[hsl(var(--exsify-accent))]" />
                <span className="text-white font-bold text-sm">{item.value}</span>
                <span className="text-gray-400 text-xs">{item.label}</span>
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
