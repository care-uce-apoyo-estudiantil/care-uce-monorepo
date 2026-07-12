// Location: apps/care-uce-mobile/src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import authService, { User, RegisterPayload } from '../services/authService';

export interface UseAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check active session on initialization
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = await authService.getStoredUser();
        const isAuth = !!storedUser;
        setIsAuthenticated(isAuth);
        if (isAuth) setUser(storedUser);
      } catch (err: unknown) {
        console.error('Error checking auth status:', err);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      // Ensure the returned user is enriched exactly like the stored version
      const completeUser = await authService.getStoredUser();
      setUser(completeUser || response.user);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string })?.message || 'Error during login';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(payload);
      if (response.user) {
        const completeUser = await authService.getStoredUser();
        setUser(completeUser || response.user);
        setIsAuthenticated(true);
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { message?: string })?.message || 'Error during registration';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err: unknown) {
      console.error(err);
      setError('Error during logout');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    isAuthenticated,
    user,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
