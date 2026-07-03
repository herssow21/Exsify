import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserRole, CurrencyCode } from '../types';
import { getUsers } from '../utils/dbOperations';
import { encodePassword, decodePassword, generateId } from '../utils/validators';
import { trpcClient } from '../utils/trpcVanilla';
import { fromApiUser } from '../utils/backendMappers';
import { syncFavorites } from '../utils/syncEngine';

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
        syncFavorites(parsedUser.id).catch(() => {});
      } catch {
        localStorage.removeItem('exsify_current_user');
      }
    }
    setIsLoading(false);
  }, []);

  const persistCurrentUser = (u: User) => {
    setUser(u);
    setIsAuthenticated(true);
    localStorage.setItem('exsify_current_user', JSON.stringify(u));
    syncFavorites(u.id).catch(() => {});
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; requiresPasswordChange?: boolean; error?: string }> => {
    try {
      // Try backend first
      const result = await trpcClient.localAuth.login.mutate({ email, password });
      if (result.user) {
        const loggedInUser = fromApiUser(result.user);
        // Preserve password locally so profile password change works offline
        const localUsers = getUsers();
        const existing = localUsers.find(u => u.email.toLowerCase() === loggedInUser.email.toLowerCase());
        loggedInUser.password = existing?.password ?? encodePassword(password);
        persistCurrentUser(loggedInUser);
        return { success: true, requiresPasswordChange: loggedInUser.requiresPasswordChange };
      }
    } catch (err) {
      // Backend unavailable or invalid credentials — fall back to localStorage
    }

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
      persistCurrentUser(foundUser);
      return { success: true, requiresPasswordChange: !!foundUser.requiresPasswordChange };
    } catch {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Try backend first
      const result = await trpcClient.localAuth.signup.mutate({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        country: userData.country,
        region: userData.region,
        currency: userData.currency,
      });
      if (result.user) {
        const newUser: User = {
          ...fromApiUser(result.user),
          password: encodePassword(userData.password),
        };
        const users = getUsers();
        users.push(newUser);
        localStorage.setItem('exsify_users', JSON.stringify(users));
        persistCurrentUser(newUser);
        return { success: true };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('already exists')) {
        return { success: false, error: 'An account with this email already exists' };
      }
      // Backend unavailable — fall back to localStorage
    }

    try {
      let users = getUsers();
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists' };
      }
      const newUser: User = {
        id: generateId(),
        fullName: userData.fullName,
        email: userData.email,
        password: encodePassword(userData.password),
        role: 'customer' as UserRole,
        country: userData.country,
        region: userData.region,
        currency: userData.currency as CurrencyCode,
        createdAt: new Date().toISOString(),
      };
      users = getUsers();
      users.push(newUser);
      localStorage.setItem('exsify_users', JSON.stringify(users));
      persistCurrentUser(newUser);
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred during signup' };
    }
  };

  const logout = () => {
    trpcClient.localAuth.logout.mutate().catch(() => {});
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
