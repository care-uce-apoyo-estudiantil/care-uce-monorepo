import { useState, useEffect, useCallback } from 'react';
import authService, { AuthResponse, User } from '../services/authService';

export interface UseAuthReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar si hay sesión al iniciar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        if (isAuth) {
          const storedUser = await authService.getStoredUser();
          setUser(storedUser);
        }
      } catch (err) {
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
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(email, password, 'student');
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
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
    } catch (err: any) {
      setError('Error al cerrar sesión');
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
