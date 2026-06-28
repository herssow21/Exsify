import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { kenyanCounties } from '../utils/kenyanMarket';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

const countries = [
  'Saudi Arabia',
  'UAE',
  'Egypt',
  'Nigeria',
  'Kenya',
  'South Africa',
  'Qatar',
  'Morocco',
  'Tunisia',
  'Algeria',
  'Jordan',
  'Kuwait',
  'Bahrain',
  'Oman'
];

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'KES', name: 'Kenyan Shilling' }
];

export default function Auth() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, signup, isAuthenticated } = useAuth();
  const { setCurrency } = useSettings();
  const { showToast } = useToast();
  const isRTL = i18n.language === 'ar';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [forgotEmail, setForgotEmail] = useState('');

  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: countries[0],
    region: '',
    currency: 'USD'
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      showToast('Welcome back!', 'success');
      navigate('/');
    } else {
      showToast(result.error || 'Login failed', 'error');
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('exsify_users') || '[]');
      const foundUser = users.find((u: any) => u.email.toLowerCase() === forgotEmail.toLowerCase());

      if (!foundUser) {
        showToast('If this email exists, a reset link has been sent', 'success');
        setIsLoading(false);
        setMode('login');
        return;
      }

      // In a real app, this would send an email. Here we generate a reset token.
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetExpiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      const updatedUsers = users.map((u: any) => {
        if (u.email.toLowerCase() === forgotEmail.toLowerCase()) {
          return { ...u, resetToken, resetExpiry };
        }
        return u;
      });

      localStorage.setItem('exsify_users', JSON.stringify(updatedUsers));
      showToast('Reset instructions sent to your email', 'success');
      setForgotEmail('');
      setMode('login');
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (signupData.password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setIsLoading(true);

    const result = await signup({
      fullName: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
      country: signupData.country,
      region: signupData.region || undefined,
      currency: signupData.currency
    });

    if (result.success) {
      setCurrency(signupData.currency as any);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } else {
      showToast(result.error || 'Signup failed', 'error');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[hsl(var(--exsify-primary))] to-[hsl(var(--exsify-primary-dark))] rounded-xl flex items-center justify-center">
              <img src="/exsify_logo.png" alt="Logo" className="w-8 h-8" />
            </div>
            <span className="text-[#1E293B] font-bold text-2xl">{t('app.name')}</span>
          </Link>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8"
        >
          {/* Tabs */}
          {mode !== 'forgot' ? (
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-[hsl(var(--exsify-primary))] text-white'
                    : 'text-gray-500 hover:text-[#1E293B]'
                }`}
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-[hsl(var(--exsify-primary))] text-white'
                    : 'text-gray-500 hover:text-[#1E293B]'
                }`}
              >
                {t('nav.signup')}
              </button>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#1E293B] text-center">Reset Password</h2>
              <p className="text-gray-500 text-sm text-center mt-1">Enter your email to receive reset instructions</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === 'forgot' ? (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleForgotPassword}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
                  >
                    Back to Login
                  </button>
                </p>
              </motion.form>
            ) : mode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.login.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={e => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.login.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[hsl(var(--exsify-primary))]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-500">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--exsify-primary))] focus:ring-[hsl(var(--exsify-primary))]" />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
                  >
                    {t('auth.login.forgotPassword')}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('auth.login.submit')}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  {t('auth.login.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
                  >
                    {t('auth.login.signup')}
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.signup.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signupData.fullName}
                      onChange={e => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.signup.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={e => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.signup.password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.password}
                      onChange={e => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[hsl(var(--exsify-primary))]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.signup.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupData.confirmPassword}
                      onChange={e => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] placeholder-gray-400 focus:border-[hsl(var(--exsify-primary))] focus:outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.signup.country')}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={signupData.country}
                        onChange={e => setSignupData(prev => ({ ...prev, country: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] focus:border-[hsl(var(--exsify-primary))] focus:outline-none appearance-none"
                      >
                        {countries.map(country => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {signupData.country === 'Kenya' && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        County / Region
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={signupData.region}
                          onChange={e => setSignupData(prev => ({ ...prev, region: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] focus:border-[hsl(var(--exsify-primary))] focus:outline-none appearance-none"
                          required
                        >
                          <option value="">Select county</option>
                          {kenyanCounties.map(county => (
                            <option key={county.code} value={county.name}>
                              {county.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.signup.currency')}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={signupData.currency}
                        onChange={e => setSignupData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-[#1E293B] focus:border-[hsl(var(--exsify-primary))] focus:outline-none appearance-none"
                      >
                        {currencies.map(curr => (
                          <option key={curr.code} value={curr.code}>
                            {curr.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[hsl(var(--exsify-primary))] text-white rounded-lg font-semibold hover:bg-[hsl(var(--exsify-primary-dark))] transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {t('auth.signup.submit')}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  {t('auth.signup.hasAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-[hsl(var(--exsify-primary))] hover:underline font-medium"
                  >
                    {t('auth.signup.login')}
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
