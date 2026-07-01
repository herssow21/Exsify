import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SystemTicker from './SystemTicker';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAuthenticated && user?.requiresPasswordChange && location.pathname !== '/change-password') {
      navigate('/change-password', { replace: true });
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return (
    <div className={`min-h-screen flex flex-col ${isAdmin ? 'bg-[hsl(var(--exsify-dark))]' : 'bg-[#F8FAFC] dark:bg-[#0B1120]'}`}>
      <SystemTicker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
