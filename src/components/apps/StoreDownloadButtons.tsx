import { Smartphone, Apple, Monitor } from 'lucide-react';
import type { App } from '../../types';

interface StoreDownloadButtonsProps {
  app: App;
  className?: string;
}

export default function StoreDownloadButtons({ app, className = '' }: StoreDownloadButtonsProps) {
  const links = [
    {
      id: 'play-store',
      label: 'Google Play',
      sublabel: 'Get it on',
      icon: Smartphone,
      href: app.playStoreUrl,
      color: 'hover:border-green-500 hover:text-green-500'
    },
    {
      id: 'app-store',
      label: 'App Store',
      sublabel: 'Download on the',
      icon: Apple,
      href: app.appStoreUrl,
      color: 'hover:border-blue-500 hover:text-blue-500'
    },
    {
      id: 'desktop',
      label: 'Desktop',
      sublabel: 'Get the',
      icon: Monitor,
      href: app.desktopUrl,
      color: 'hover:border-purple-500 hover:text-purple-500'
    }
  ];

  const visibleLinks = links.filter((link) => link.href && link.href !== '#');

  if (visibleLinks.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm text-gray-500 text-center">Also available on</p>
      <div className="grid grid-cols-1 gap-2">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl transition-colors ${link.color} group`}
            >
              <Icon className="w-6 h-6 text-gray-400 group-hover:text-current flex-shrink-0" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">{link.sublabel}</p>
                <p className="text-sm font-semibold text-[#1E293B]">{link.label}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
