import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🌍 ENVIRONMENT MANAGEMENT (Uncomment the one you are going to use)
//const API_BASE_URL = 'http://10.10.12.162:3000/api'; // Local (Your physical IP)
const API_BASE_URL = 'http://100.28.235.67/api';
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

// Strictly type the registration payload to match the backend DTO
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

    // Request interceptor to attach the token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('auth_token'); // 📱 Mobile uses AsyncStorage
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

    // Response interceptor for error handling (e.g., 401 Unauthorized)
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      },
    );
  }

  // Register a new user
  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
      // Send the complete DTO and specify the origin so backend assigns 'student' role
      const response = await this.api.post<AuthResponse>(
        '/auth/register',
        data,
        {
          headers: {
            'x-client-origin': 'mobile',
          },
        },
      );

      // If the backend returns a token immediately upon registration, store it
      if (response.data.access_token) {
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // 🔥 THE FIX: Extract backend messages and convert Array to a single String
        const validationMessages = error.response?.data?.message;
        const formattedMessage = Array.isArray(validationMessages)
          ? validationMessages.join('\n') // Joins array items with a line break
          : validationMessages || 'Registration error';

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
        await AsyncStorage.setItem('auth_token', response.data.access_token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Get stored token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error: unknown) {
      console.error('Error fetching token:', error);
      return null;
    }
  }

  // Get stored user
  async getStoredUser(): Promise<User | null> {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error: unknown) {
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
