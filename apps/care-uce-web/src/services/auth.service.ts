import axios, { AxiosInstance } from 'axios';
import { AuthFormData } from '../components/organisms/AuthForm'; // Import the new interface

// 🌍 GESTIÓN DE ENTORNOS (Descomenta el que vayas a usar)
const API_BASE_URL = 'http://10.10.12.162:3000/api'; // Local
// const API_BASE_URL = 'http://100.28.235.67/api'; // QA
// const API_BASE_URL = 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api'; // Prod

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

    // Interceptor to add token to every request
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = localStorage.getItem('auth_token'); // 🌐 Web uses localStorage
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
        // Get current path
        const currentPath = window.location.pathname;

        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');

          // ONLY redirect if we are NOT already on the Auth screen
          if (currentPath !== '/auth' && currentPath !== '/login') {
            window.location.href = '/auth';
          }
        }
        return Promise.reject(error);
      },
    );
  }

  // Register a new user
  // Updated to receive AuthFormData instead of individual strings
  async register(formData: AuthFormData): Promise<AuthResponse> {
    try {
      // Send the entire object. The backend will validate it using the DTO.
      // We inject the 'x-client-origin' header so the backend assigns the 'control_personnel' role
      const response = await this.api.post<AuthResponse>(
        '/auth/register',
        formData,
        {
          headers: {
            'x-client-origin': 'web',
          },
        },
      );

      // The backend returns the newly created user (without token for registration).
      // Note: If you want to auto-login after registration, the backend should return the token,
      // or you should make a login request immediately after registration succeeds.
      // Assuming your backend currently only returns the user object, we skip setting the token here.

      // We cast the response to match what the UI expects or what the backend actually returns
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // We attempt to extract the detailed validation messages from NestJS
        const validationMessages = error.response?.data?.message;
        const formattedMessage = Array.isArray(validationMessages)
          ? validationMessages.join(', ')
          : validationMessages || 'Error in registration';

        throw {
          message: formattedMessage,
          status: error.response?.status || 500,
        };
      }
      throw {
        message: 'Unexpected server error',
        status: 500,
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
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || 'Invalid credentials',
          status: error.response?.status || 500,
        };
      }
      throw {
        message: 'Unexpected server error',
        status: 500,
      };
    }
  }

  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<{ user: User }>('/auth/profile');
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw {
          message: error.response?.data?.message || 'Error fetching profile',
          status: error.response?.status || 500,
        };
      }
      throw {
        message: 'Unexpected server error',
        status: 500,
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Get saved token
  async getToken(): Promise<string | null> {
    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }

  // Get saved user
  async getStoredUser(): Promise<User | null> {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // Validate active session
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export default new AuthService();
