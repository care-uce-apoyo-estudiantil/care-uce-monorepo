import { useState, useEffect, useCallback } from 'react';
// 1. Removed unused AuthResponse and imported RegisterPayload
import authService, { User, RegisterPayload } from '../services/authService';

export interface UseAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  // 2. Updated register signature to accept the complete payload
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if there is an active session on startup
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // authService may not expose isAuthenticated; derive auth status from stored user
        const storedUser = await authService.getStoredUser();
        const isAuth = !!storedUser;
        setIsAuthenticated(isAuth);
        if (isAuth) setUser(storedUser);
      } catch (err: unknown) {
        // ESLint fix: replaced any with unknown
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
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      // ESLint fix: replaced any with unknown
      // Safely extract the error message
      const errorMessage =
        (err as { message?: string })?.message || 'Error during login';
      setError(errorMessage);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 3. Updated function to receive the complete payload
  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      // Send the payload to the service
      const response = await authService.register(payload);

      // If your backend doesn't return the user object immediately upon registration,
      // you might need to adjust this depending on your API design.
      if (response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (err: unknown) {
      // ESLint fix: replaced any with unknown
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
      // ESLint fix: replaced any with unknown
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
