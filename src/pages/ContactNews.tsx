import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, Calendar, ArrowRight, Newspaper,
  Building2, User, DollarSign, Globe, MessageSquare, CheckCircle,
  Briefcase, Code, Wrench, Linkedin, Facebook, Instagram, Twitter, MessageCircle
} from 'lucide-react';
import { useNews } from '../hooks/useDatabase';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { partnerCountries } from '../utils/countryFlags';
import { convertPrice, getCurrencySymbol, formatNumber } from '../utils/currencyConverter';
import type { CurrencyCode } from '../types';

const serviceOptions = [
  { value: 'KaatibPOS', label: 'KaatibPOS - Retail POS', icon: Briefcase },
  { value: 'Bxsfy', label: 'Bxsfy - Business Suite', icon: Building2 },
  { value: 'CargoFlow', label: 'CargoFlow - Logistics', icon: Globe },
  { value: 'AqariX', label: 'AqariX - Real Estate', icon: Building2 },
  { value: 'StockPulse', label: 'StockPulse - Inventory', icon: Wrench },
  { value: 'VaultFin', label: 'VaultFin - Accounting', icon: DollarSign },
  { value: 'MarketCore', label: 'MarketCore - E-commerce', icon: Briefcase },
  { value: 'AfyaCare', label: 'AfyaCare - Healthcare', icon: MessageSquare },
  { value: 'Custom', label: 'Custom Development', icon: Code },
];

const countries = [
  'Saudi Arabia', 'UAE', 'Egypt', 'Nigeria', 'Kenya',
  'South Africa', 'Qatar', 'Morocco', 'Tunisia', 'Algeria',
  'Jordan', 'Kuwait', 'Bahrain', 'Oman'
];

function getBudgetOptions(currency: CurrencyCode) {
  const symbol = getCurrencySymbol(currency);
  const fmt = (n: number) => formatNumber(Math.round(convertPrice(n, currency)));
  return [
    { value: '<5k', label: `Under ${symbol}${fmt(5000)}` },
    { value: '5k-20k', label: `${symbol}${fmt(5000)} - ${symbol}${fmt(20000)}` },
    { value: '20k-50k', label: `${symbol}${fmt(20000)} - ${symbol}${fmt(50000)}` },
    { value: '50k+', label: `${symbol}${fmt(50000)}+` },
  ];
}

const socialLinks = [
  { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/254727880041', color: 'bg-green-500' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/exsify', color: 'bg-blue-700' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/exsify', color: 'bg-sky-500' },
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/exsify', color: 'bg-blue-600' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/exsifysoftware', color: 'bg-pink-600' },
];

export default function ContactNews() {
  const { t, i18n } = useTranslation();
  const { news } = useNews();
  const { showToast } = useToast();
  const { currency } = useSettings();
  const isRTL = i18n.language === 'ar';
  const [searchParams] = useSearchParams();

  const [activeForm, setActiveForm] = useState<'contact' | 'consultation'>(
    searchParams.get('form') === 'consultation' ? 'consultation' : 'contact'
  );

  const budgetOptions = useMemo(() => getBudgetOptions(currency as CurrencyCode), [currency]);

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [consultationData, setConsultationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: 'KaatibPOS',
    budget: budgetOptions[0].value,
    country: 'Saudi Arabia',
    projectDetails: ''
  });

  useEffect(() => {
    setConsultationData(prev => ({ ...prev, budget: budgetOptions[0].value }));
  }, [budgetOptions]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const messages = JSON.parse(localStorage.getItem('exsify_messages') || '[]');
    messages.push({
      id: `msg-${Date.now()}`,
      name: contactData.name,
      email: contactData.email,
      company: contactData.company || '',
      message: contactData.message,
      status: 'new',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('exsify_messages', JSON.stringify(messages));

    showToast('Thank you for your message! We will get back to you soon.', 'success');
    setContactData({ name: '', email: '', company: '', message: '' });
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationData.fullName || !consultationData.email || !consultationData.projectDetails) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const consultations = JSON.parse(localStorage.getItem('exsify_consultations') || '[]');
    consultations.push({
      id: `consult-${Date.now()}`,
      ...consultationData,
      status: 'new',
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('exsify_consultations', JSON.stringify(consultations));

    showToast('Consultation request submitted! Our team will contact you under 1 hour.', 'success');
    setConsultationData({
      fullName: '', email: '', phone: '', company: '',
      serviceInterest: 'KaatibPOS', budget: '<$5k',
      country: 'Saudi Arabia', projectDetails: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Public page shows only featured news
  const featuredNews = news.filter(n => n.featured).slice(0, 6);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact / Consultation Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] dark:text-white mb-6 tracking-tight text-start">
              Get in{' '}
              <span className="bg-gradient-to-r from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-8 max-w-lg text-start">
              Have a question or want to learn more about our solutions?
              We'd love to hear from you.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[hsl(var(--exsify-primary))]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-[hsl(var(--exsify-primary))]" />
                </div>
                <div>
                  <h3 className="text-[#1E293B] dark:text-white font-bold mb-1">Email</h3>
                  <a href="mailto:info@exsify.com" className="text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--exsify-primary))] transition-colors">
                    info@exsify.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[hsl(var(--exsify-primary))]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-[hsl(var(--exsify-primary))]" />
                </div>
                <div>
                  <h3 className="text-[#1E293B] dark:text-white font-bold mb-1">Phone / WhatsApp</h3>
                  <a href="tel:+966501234567" className="text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--exsify-primary))] transition-colors block">
                    +966 50 123 4567 (KSA)
                  </a>
                  <a href="tel:+254712345678" className="text-gray-600 dark:text-gray-300 hover:text-[hsl(var(--exsify-primary))] transition-colors block">
                    +254 727 880 041 (Kenya)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[hsl(var(--exsify-primary))]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[hsl(var(--exsify-primary))]" />
                </div>
                <div>
                  <h3 className="text-[#1E293B] dark:text-white font-bold mb-1">Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Business District<br />
                    Riyadh, Saudi Arabia
                  </p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8">
              <h3 className="text-[#1E293B] dark:text-white font-bold mb-3">Connect with us</h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 ${social.color} rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
                <p className="text-2xl font-black text-[hsl(var(--exsify-primary))]">&lt;1h</p>
                <p className="text-gray-500 dark:text-gray-300 text-xs">Response Time</p>
              </div>
              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
                <p className="text-2xl font-black text-[hsl(var(--exsify-primary))]">{partnerCountries.length}+</p>
                <p className="text-gray-500 dark:text-gray-300 text-xs">Countries</p>
              </div>
              <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center shadow-sm">
                <p className="text-2xl font-black text-[hsl(var(--exsify-primary))]">8</p>
                <p className="text-gray-500 dark:text-gray-300 text-xs">Software Products</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form Area */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden"
          >
            {/* Form Toggle Tabs */}
            <div className="bg-gray-50 dark:bg-[#0B1120] border-b border-gray-200 dark:border-white/10 p-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-3">
                Choose how you'd like to reach us
              </p>
              <div className="flex rounded-xl bg-white dark:bg-[#1E293B] p-1 border border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setActiveForm('contact')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeForm === 'contact'
                      ? 'bg-[hsl(var(--exsify-primary))] text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-300 hover:text-[#1E293B] dark:hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Quick Message
                </button>
                <button
                  onClick={() => setActiveForm('consultation')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeForm === 'consultation'
                      ? 'bg-[hsl(var(--exsify-primary))] text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-300 hover:text-[#1E293B] dark:hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Strategy Consultation
                </button>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-300">
                {activeForm === 'contact'
                  ? 'Best for general questions, support requests, or feedback.'
                  : 'Best for project proposals, custom solutions, and scoping calls.'}
              </p>
            </div>

            <div className="p-6 md:p-8">
              {activeForm === 'contact' ? (
                <>
                  <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-1">Send us a Message</h2>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">General inquiries, support, or feedback</p>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Name *</label>
                      <input
                        type="text"
                        value={contactData.name}
                        onChange={e => setContactData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email *</label>
                      <input
                        type="email"
                        value={contactData.email}
                        onChange={e => setContactData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Company</label>
                      <input
                        type="text"
                        value={contactData.company}
                        onChange={e => setContactData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                        placeholder="Your company (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Message *</label>
                      <textarea
                        value={contactData.message}
                        onChange={e => setContactData(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#1E293B] dark:text-white mb-1">Request Consultation</h2>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">Tell us about your project and we'll craft a solution</p>
                  <form onSubmit={handleConsultationSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={consultationData.fullName}
                          onChange={e => setConsultationData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email *</label>
                        <input
                          type="email"
                          value={consultationData.email}
                          onChange={e => setConsultationData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={consultationData.phone}
                          onChange={e => setConsultationData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                          placeholder="+966 50 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Company</label>
                        <input
                          type="text"
                          value={consultationData.company}
                          onChange={e => setConsultationData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                          placeholder="Your company"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Service Interest *</label>
                        <select
                          value={consultationData.serviceInterest}
                          onChange={e => setConsultationData(prev => ({ ...prev, serviceInterest: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                        >
                          {serviceOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Budget Range</label>
                        <select
                          value={consultationData.budget}
                          onChange={e => setConsultationData(prev => ({ ...prev, budget: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                        >
                          {budgetOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Country</label>
                      <select
                        value={consultationData.country}
                        onChange={e => setConsultationData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      >
                        {countries.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Project Details *</label>
                      <textarea
                        value={consultationData.projectDetails}
                        onChange={e => setConsultationData(prev => ({ ...prev, projectDetails: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0B1120] border border-gray-200 dark:border-white/10 rounded-lg text-[#1E293B] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-[hsl(var(--exsify-primary))] focus:outline-none resize-none"
                        placeholder="Describe your project requirements, goals, and timeline..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Request Strategy Call
                    </button>

                    <p className="text-center text-gray-500 dark:text-gray-300 text-xs">
                      Our team will review your request and contact you under 1 hour.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* News Section - only featured/admin-selected news is shown publicly */}
        {featuredNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="w-8 h-8 text-[hsl(var(--exsify-primary))]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] dark:text-white">Latest News</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNews.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white dark:bg-[#1E293B] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-[hsl(var(--exsify-primary))]/40 transition-all shadow-sm"
                >
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={isRTL ? item.title_ar : item.title_en}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-300 text-xs mb-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.publishedAt)}
                    </div>
                    <h3 className="text-[#1E293B] dark:text-white font-bold mb-2 line-clamp-2">
                      {isRTL ? item.title_ar : item.title_en}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300 text-sm line-clamp-2">
                      {isRTL ? item.content_ar : item.content_en}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
