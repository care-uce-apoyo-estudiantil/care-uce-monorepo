// Location: apps/care-uce-web/src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Activity, RefreshCw } from 'lucide-react';
import authService from '../services/auth.service';
import adminService, { UserData } from '../services/admin.service';

// FIX: Changed to named export to perfectly match the router wrapper matching 'App.tsx' import rules
export function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching dashboard users data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      // Optimistic UI state update block
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch {
      alert('Error updating role. Check analytical system connections.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-600" size={28} />
          <h1 className="text-xl font-bold text-slate-800">
            CareUCE <span className="text-blue-600">Admin Portal</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Main Analytical Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-slate-500" /> Gestión de Accesos y Usuarios
            </h2>
            <p className="text-slate-500 mt-1">
              Supervisa y asigna roles a todos los miembros de la plataforma.
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />{' '}
            Refrescar
          </button>
        </div>

        {/* Dynamic Real-Time Users Table Block */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center text-slate-400">
              <Activity className="animate-spin mb-4" size={40} />
              <p>Cargando base de datos...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nombre / Cédula</th>
                  <th className="px-6 py-4">Correo Institucional</th>
                  <th className="px-6 py-4">Fecha de Registro</th>
                  <th className="px-6 py-4">Rol de Acceso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 capitalize">
                        {user.nombre}
                      </p>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        CI: {user.cedula}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium">{user.email}</td>
                    <td className="px-6 py-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className={`font-bold text-xs rounded-lg px-3 py-2 border-2 outline-none transition-colors cursor-pointer
                          ${user.role === 'admin' || user.role === 'auditor' ? 'bg-purple-50 text-purple-700 border-purple-200 focus:border-purple-500' : ''}
                          ${user.role === 'doctor' ? 'bg-teal-50 text-teal-700 border-teal-200 focus:border-teal-500' : ''}
                          ${user.role === 'student' ? 'bg-slate-100 text-slate-600 border-slate-200 focus:border-slate-400' : ''}
                        `}
                      >
                        <option value="student">Estudiante (Móvil)</option>
                        <option value="doctor">Doctor (Escritorio)</option>
                        <option value="admin">Administrador (Web)</option>
                        <option value="auditor">Auditor (Web)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
