import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare const process: { env: { EXPO_PUBLIC_API_URL?: string } } | undefined;

// 🌍 ENVIRONMENT MANAGEMENT (Uncomment the one you are going to use)
const API_BASE_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3000/api`; // Local (Your physical IP)
//const API_BASE_URL = 'http://100.28.235.67/api';
// const API_BASE_URL = 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api'; // Prod
export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    nombre: string;
    cedula: string;
  };
}

export interface User {
  id?: string;
  email: string;
  role?: string;
  nombre?: string;
  name?: string; // Alias inyectado para la UI
  fullName?: string; // Alias inyectado para la UI
  cedula?: string;
}

export interface RegisterPayload {
  fullName: string;
  idCard: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error reading token:', error);
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      },
    );
  }

  // 🔥 UTILIDAD: Enriquecemos el objeto para que la UI encuentre siempre el nombre
  private enrichUser(userData: Partial<User>): User {
    return {
      ...userData,
      name: userData.nombre,
      fullName: userData.nombre,
    } as User;
  }

  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>(
        '/auth/register',
        data,
        { headers: { 'x-client-origin': 'mobile' } },
      );

      if (response.data.access_token) {
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        // Guardamos el usuario con los alias
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(this.enrichUser(response.data.user)),
        );
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const validationMessages = error.response?.data?.message;
        const formattedMessage = Array.isArray(validationMessages)
          ? validationMessages.join('\n')
          : validationMessages || 'Registration error';

        throw {
          message: formattedMessage,
          status: error.response?.status || 500,
        };
      }
      throw { message: 'Unexpected server error', status: 500 };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      if (response.data.user.role !== 'student') {
        throw {
          message:
            'Acceso Denegado: Esta aplicación móvil es de uso exclusivo para Estudiantes.',
          status: 403,
        };
      }

      if (response.data.access_token) {
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        // Guardamos el usuario con los alias
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(this.enrichUser(response.data.user)),
        );
      }
      return response.data;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        (error as { status?: number }).status === 403
      )
        throw error;

      if (axios.isAxiosError(error)) {
        const validationMessages = error.response?.data?.message;
        const formattedMessage = Array.isArray(validationMessages)
          ? validationMessages.join('\n')
          : validationMessages || 'Invalid credentials';

        throw {
          message: formattedMessage,
          status: error.response?.status || 500,
        };
      }
      throw { message: 'Unexpected server error', status: 500 };
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<{ user: User }>('/auth/profile');
      return this.enrichUser(response.data.user);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || 'Error',
          status: error.response?.status || 500,
        };
      }
      throw { message: 'Unexpected server error', status: 500 };
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  async getStoredUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
