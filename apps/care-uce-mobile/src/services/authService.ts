import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.10:3000/api';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface User {
  id?: string;
  email: string;
  role?: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Interceptor para agregar el token en cada request
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error al leer token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejo de errores
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado, limpiar storage
          await AsyncStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
      }
    );
  }

  // Registro de nuevo usuario
  async register(
    email: string,
    password: string,
    role: string = 'student'
  ): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', {
        email,
        password,
        role,
      });

      // Guardar token
      if (response.data.access_token) {
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error en registro',
        status: error.response?.status || 500,
      };
    }
  }

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      // Guardar token
      if (response.data.access_token) {
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Credenciales inválidas',
        status: error.response?.status || 500,
      };
    }
  }

  // Obtener perfil del usuario
  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<{ user: User }>('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      throw {
        message: error.response?.data?.message || 'Error al obtener perfil',
        status: error.response?.status || 500,
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error al logout:', error);
    }
  }

  // Obtener token guardado
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  }

  // Obtener usuario guardado
  async getStoredUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  // Validar si hay sesión activa
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export default new AuthService();