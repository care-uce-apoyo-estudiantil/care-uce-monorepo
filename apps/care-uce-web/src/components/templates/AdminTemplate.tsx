import React from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import authService from '../../services/auth.service';

// 1. Hacemos que 'children' sea opcional con el signo de interrogación (?)
interface AdminTemplateProps {
  children?: React.ReactNode;
}

// 2. Quitamos React.FC para que TypeScript en Storybook no se confunda
export const AdminTemplate = ({ children }: AdminTemplateProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/auth');
  };

  // Función para resaltar el menú activo
  const getNavClass = (path: string) => {
    const baseClass =
      'flex items-center gap-3 p-3 rounded font-medium transition-colors ';
    return location.pathname === path
      ? baseClass + 'bg-blue-800 opacity-100'
      : baseClass + 'hover:bg-blue-800 opacity-75 hover:opacity-100';
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-[#003366] text-white flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-extrabold border-b border-blue-800 tracking-wider">
          CareUCE <span className="text-blue-300">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-3 mt-4">
          <Link to="/dashboard" className={getNavClass('/dashboard')}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard General
          </Link>
          <Link to="/estudiantes" className={getNavClass('/estudiantes')}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Gestión de Estudiantes
          </Link>
          <Link to="/alertas" className={getNavClass('/alertas')}>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Registro de Alertas
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded text-red-300 hover:bg-red-500 hover:text-white font-bold transition-all flex items-center gap-3"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b">
          <h1 className="text-xl font-semibold text-gray-800">
            Panel de Bienestar Estudiantil
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">
              Administración Central
            </span>
            <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          {/* 3. La magia: Si mandas children (Storybook) lo pinta. Si no (App.tsx), usa Outlet */}
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};
