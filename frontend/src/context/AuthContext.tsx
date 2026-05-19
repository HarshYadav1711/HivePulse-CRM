import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { UserPublic, UserRole } from '@hivepulse/shared';
import { api, ApiClientError } from '@/lib/api';
import { storage } from '@/lib/storage';

interface AuthContextValue {
  user: UserPublic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserPublic | null>(storage.getUser());
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback((token: string, nextUser: UserPublic) => {
    storage.setToken(token);
    storage.setUser(nextUser);
    setUser(nextUser);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = storage.getToken();
    if (!token) {
      setUser(null);
      return;
    }
    const res = await api.auth.me();
    storage.setUser(res.data);
    setUser(res.data);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const token = storage.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        await refreshUser();
      } catch {
        storage.clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.login({ email, password });
      persistSession(res.data.accessToken, res.data.user);
    },
    [persistSession],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, role?: UserRole) => {
      const res = await api.auth.register({ name, email, password, role });
      persistSession(res.data.accessToken, res.data.user);
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    storage.clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getFieldErrors(err: unknown): Record<string, string> {
  if (err instanceof ApiClientError && err.details) {
    return Object.fromEntries(
      Object.entries(err.details).map(([key, messages]) => [key, messages[0] ?? 'Invalid value']),
    );
  }
  return {};
}
