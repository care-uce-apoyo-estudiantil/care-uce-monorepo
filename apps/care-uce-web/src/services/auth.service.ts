// Location: apps/care-uce-web/src/services/auth.service.ts
import axios from 'axios';

type RegisterFormData = {
  fullName?: string;
  nombre?: string;
  idCard?: string;
  cedula?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

//const API_URL = import.meta.env.VITE_API_URL || 'http://100.28.235.67/api';
//const API_URL = import.meta.env.VITE_API_URL || 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api';

const API_URL = `${import.meta.env.VITE_BASE_IP}:3000/api`;
class AuthService {
  async login(
    email: string,
    password: string,
  ): Promise<Record<string, unknown>> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const allowedRoles = ['admin', 'auditor'];
      if (!allowedRoles.includes(response.data.user.role)) {
        throw new Error(
          'Acceso Denegado: Solo personal administrativo puede ingresar.',
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

  // Se añade el register respetando el DTO y mandando el header 'web'
  async register(formData: RegisterFormData): Promise<Record<string, unknown>> {
    try {
      const payload = {
        fullName: formData.fullName || formData.nombre || 'Administrador Web',
        idCard: formData.idCard || formData.cedula || '0000000000',
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword || formData.password,
      };

      const response = await axios.post(`${API_URL}/auth/register`, payload, {
        headers: { 'x-client-origin': 'web' }, // Esto le dice al backend que es Auditor/Admin
      });

      return response.data as Record<string, unknown>;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msgs = error.response?.data?.message;
        throw new Error(
          Array.isArray(msgs)
            ? msgs.join('\n')
            : msgs || 'Error al registrar administrador',
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
