import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Library,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import CurrencySwitcher from '../ui/CurrencySwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/who-we-are', label: t('nav.whoWeAre') },
    { path: '/careers', label: t('nav.careers') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[hsl(var(--exsify-primary))] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img src="/Exfy_Logo.png" alt="EXSIFY" className="w-10 h-10 object-contain" />
            </div>
            <span className="text-[#fff] font-bold text-xl tracking-tight">
              {t('app.name')} 
            </span>
            <span className="text-[#dea440] font-bold TEXT-X1 tracking-tight">
              SOFTWARE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'العربية' : 'English'}
              </span>
            </button>

            {/* Currency Switcher */}
            <CurrencySwitcher />

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[hsl(var(--exsify-primary))] rounded-lg hover:bg-white/90 transition-colors font-semibold"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.fullName.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
                    >
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[hsl(var(--exsify-primary))]/10 hover:text-[hsl(var(--exsify-primary))] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="text-sm">{t('nav.admin')}</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[hsl(var(--exsify-primary))]/10 hover:text-[hsl(var(--exsify-primary))] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">My Profile</span>
                      </Link>
                      <Link
                        to="/my-library"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[hsl(var(--exsify-primary))]/10 hover:text-[hsl(var(--exsify-primary))] transition-colors"
                      >
                        <Library className="w-4 h-4" />
                        <span className="text-sm">{t('nav.myLibrary')}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">{t('nav.logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=login"
                  className="px-4 py-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="px-4 py-2 bg-white text-[hsl(var(--exsify-primary))] rounded-lg hover:bg-white/90 transition-colors text-sm font-bold"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-[hsl(var(--exsify-primary))] text-white'
                      : 'text-gray-700 hover:text-[hsl(var(--exsify-primary))] hover:bg-[hsl(var(--exsify-primary))]/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-[hsl(var(--exsify-primary))] w-full"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{language === 'en' ? 'العربية' : 'English'}</span>
                </button>
                
                <div className="px-4 py-2">
                  <CurrencySwitcher />
                </div>
                
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-[hsl(var(--exsify-primary))]"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span className="text-sm">{t('nav.admin')}</span>
                      </Link>
                    )}
                    <Link
                      to="/my-library"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-[hsl(var(--exsify-primary))]"
                    >
                      <Library className="w-4 h-4" />
                      <span className="text-sm">{t('nav.myLibrary')}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 text-red-600 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">{t('nav.logout')}</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      to="/auth?mode=login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-center text-gray-700 hover:text-[hsl(var(--exsify-primary))] border border-gray-200 rounded-lg"
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 text-center bg-[hsl(var(--exsify-primary))] text-[#1E293B] rounded-lg font-bold"
                    >
                      {t('nav.signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
