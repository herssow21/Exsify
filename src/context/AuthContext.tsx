import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, CurrencyCode } from '../types';
import { getUsers, addUser as dbAddUser } from '../utils/dbOperations';
import { encodePassword, decodePassword } from '../utils/validators';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresPasswordChange?: boolean; error?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  region?: string;
  currency: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('exsify_current_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('exsify_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; requiresPasswordChange?: boolean; error?: string }> => {
    try {
      const users = getUsers();
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      const decodedPassword = decodePassword(foundUser.password);
      if (decodedPassword !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      const updatedUser = { ...foundUser };
      setUser(updatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('exsify_current_user', JSON.stringify(updatedUser));
      return { success: true, requiresPasswordChange: !!foundUser.requiresPasswordChange };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = getUsers();
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        fullName: userData.fullName,
        email: userData.email,
        password: encodePassword(userData.password),
        role: 'customer' as UserRole,
        country: userData.country,
        region: userData.region,
        currency: userData.currency as CurrencyCode,
        createdAt: new Date().toISOString()
      };

      dbAddUser(newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('exsify_current_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('exsify_current_user');
  };

  const refreshUser = () => {
    const storedUser = localStorage.getItem('exsify_current_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        signup,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
