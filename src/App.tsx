import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { seedDatabase } from './utils/seedDatabase';
import { recordVisit } from './utils/visits';
import { syncAll } from './utils/syncEngine';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import WhoWeAre from './pages/WhoWeAre';
import Careers from './pages/Careers';
import ContactNews from './pages/ContactNews';
import MyLibrary from './pages/MyLibrary';
import AppDetail from './pages/AppDetail';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

function App() {
  useEffect(() => {
    seedDatabase();
    recordVisit();
    syncAll().catch(() => {});
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <DarkModeProvider>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <ThemeProvider>
                <Routes>
                  {/* Public Routes with Layout */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="who-we-are" element={<WhoWeAre />} />
                    <Route path="careers" element={<Careers />} />
                    <Route path="contact" element={<ContactNews />} />
                    <Route path="my-library" element={<MyLibrary />} />
                    <Route path="app/:slug" element={<AppDetail />} />
                  </Route>

                  {/* Auth Routes (without Layout) */}
                  <Route path="/auth" element={<Auth />} />

                  {/* Profile Route (with Layout) */}
                  <Route path="/profile" element={<Layout />}>
                    <Route index element={<Profile />} />
                  </Route>

                  {/* Admin Routes (without Layout) */}
                  <Route path="/admin" element={<AdminDashboard />} />

                  {/* Password Reset */}
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Force Password Change */}
                  <Route path="/change-password" element={<ChangePassword />} />

                  {/* Legal Pages */}
                  <Route path="/privacy-policy" element={<Layout />}>
                    <Route index element={<PrivacyPolicy />} />
                  </Route>
                  <Route path="/terms-of-service" element={<Layout />}>
                    <Route index element={<TermsOfService />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ThemeProvider>
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </DarkModeProvider>
    </I18nextProvider>
  );
}

export default App;
