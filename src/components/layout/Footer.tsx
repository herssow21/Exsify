import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/who-we-are', label: t('nav.whoWeAre') },
    { path: '/careers', label: t('nav.careers') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const supportLinks = [
    { path: '#', label: 'Help Center' },
    { path: '#', label: 'Documentation' },
    { path: '#', label: 'API Reference' },
    { path: '#', label: 'System Status' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/Exfy_Logo.png" alt="EXSIFY" className="w-10 h-10 object-contain" />
              </div>
               <span className="text-[#000] font-bold text-xl tracking-tight">
              {t('app.name')} 
            </span>
            <span className="text-[#dea440] font-bold TEXT-X1 tracking-tight">
              SOFTWARE
            </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-[hsl(var(--exsify-primary))] hover:text-white transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#1E293B] font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-[#1E293B] font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#1E293B] font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[hsl(var(--exsify-primary))] flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">
                  12th st Eastleigh<br />
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[hsl(var(--exsify-primary))] flex-shrink-0" />
                <a href="tel:+254727880041" className="text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors text-sm">
                  +254 727 880 041
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[hsl(var(--exsify-primary))] flex-shrink-0" />
                <a href="mailto:info@exsify.com" className="text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors text-sm">
                  info@exsify.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {t('app.name')}. {t('footer.rights')}.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors text-sm">
              {t('footer.privacy')}
            </Link>
            <Link to="#" className="text-gray-500 hover:text-[hsl(var(--exsify-primary))] transition-colors text-sm">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
