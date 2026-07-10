import axios from 'axios';

// 1. ELIMINAMOS EL PUERTO 3000 PARA QUE IGUALE AL MOBILE
//const API_BASE_URL = 'http://10.10.12.162:3000/api'; // Local
const API_URL = import.meta.env.VITE_API_URL || 'http://100.28.235.67/api';

class AuthService {
  // Login
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
        // 2. REPLICAMOS EL MANEJO DE ERRORES DEL MOBILE
        const validationMessages = error.response?.data?.message;
        const formattedMessage = Array.isArray(validationMessages)
          ? validationMessages.join(' - ') 
          : validationMessages || 'Credenciales inválidas';
          
        throw new Error(formattedMessage);
      }
      throw new Error('Error de red: No se pudo conectar con AWS');
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
        nombre,
        cedula,
        role,
      });
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 2. REPLICAMOS EL MANEJO DE ERRORES DEL MOBILE
        const validationMessages = error.response?.data?.message;
        const formattedMessage = Array.isArray(validationMessages)
          ? validationMessages.join(' - ')
          : validationMessages || 'Error al registrar el usuario';
          
        throw new Error(formattedMessage);
      }
      throw new Error('Error de red: No se pudo conectar con AWS');
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();