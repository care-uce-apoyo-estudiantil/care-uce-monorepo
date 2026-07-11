// Location: apps/care-uce-web/src/services/admin.service.ts
import axios from 'axios';

// Ensure we point to the Auth Service (Port 3000)
const API_URL = `${import.meta.env.VITE_BASE_IP}:3000/api`;
//const API_URL = import.meta.env.VITE_API_URL || 'http://100.28.235.67/apii';
//const API_URL = import.meta.env.VITE_API_URL || 'http://careuce-alb-prod-1635245767.us-east-1.elb.amazonaws.com/api';

export interface UserData {
  id: string;
  nombre: string;
  email: string;
  cedula: string;
  role: string;
  createdAt: string;
}

class AdminService {
  private getHeaders() {
    const token = localStorage.getItem('auth_token');
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Fetches the complete list of users from the database.
   */
  async getUsers(): Promise<UserData[]> {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to load users data.');
    }
  }

  /**
   * Updates the access role of a specific user.
   */
  async updateUserRole(userId: string, newRole: string): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/auth/users/${userId}/role`,
        { role: newRole },
        { headers: this.getHeaders() },
      );
    } catch (error) {
      console.error('Error updating role:', error);
      throw new Error('Failed to update user role.');
    }
  }
}

export default new AdminService();
