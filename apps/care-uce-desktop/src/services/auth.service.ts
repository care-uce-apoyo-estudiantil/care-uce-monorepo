import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://100.28.235.67:3000/api';

class AuthService {
  // Login (Se queda igual)
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
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
        throw new Error(
          error.response?.data?.message || 'Credenciales inválidas',
        );
      }
      throw new Error('Error al conectar con el servidor en AWS');
    }
  }

  // Registro ACTUALIZADO con Nombre y Cédula
  async register(
    email: string,
    password: string,
    nombre: string,
    cedula: string,
    role = 'doctor',
  ) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        nombre, // <-- Nuevo campo
        cedula, // <-- Nuevo campo
        role,
      });
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al registrar el usuario',
        );
      }
      throw new Error('Error al conectar con el servidor en AWS');
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
