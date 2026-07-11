// Location: apps/care-uce-desktop/src/services/auth.service.ts
import axios from 'axios';

// 🌍 ENVIRONMENT MANAGEMENT (Uncomment the one you are going to use)
// 🌍 La auth corre en el puerto 3000
const AUTH_API_URL = `${import.meta.env.VITE_BASE_IP}:3000/api`; // Local (Your physical IP)
//const AUTH_API_URL = 'http://100.28.235.67/api';
// const AUTH_API_URL = 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api'; // Prod

class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<Record<string, unknown>> {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.user.role !== 'doctor') {
        throw new Error(
          'Acceso Denegado: Plataforma exclusiva para personal médico.',
        );
      }

      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msgs = error.response?.data?.message;
        throw new Error(
          Array.isArray(msgs)
            ? msgs.join(' - ')
            : msgs || 'Credenciales inválidas',
        );
      }
      throw new Error((error as Error).message || 'Error de conexión');
    }
  }

  // Registro: Transformamos la data para cumplir con el estricto RegisterDto
  async register(
    email: string,
    password: string,
    nombre: string,
    cedula: string,
  ): Promise<Record<string, unknown>> {
    try {
      const payload = {
        fullName: nombre,
        idCard: cedula,
        email: email,
        password: password,
        confirmPassword: password, // Lo mandamos doble para cumplir con el DTO
      };

      const response = await axios.post(
        `${AUTH_API_URL}/auth/register`,
        payload,
        {
          headers: { 'x-client-origin': 'desktop' }, // Esto le dice al backend que es un Doctor
        },
      );

      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msgs = error.response?.data?.message;
        throw new Error(
          Array.isArray(msgs) ? msgs.join('\n') : msgs || 'Error de registro',
        );
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
