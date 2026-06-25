import React from 'react';
import { AdminTemplate } from '../components/templates/AdminTemplate';

export const AlertsPage: React.FC = () => {
  return (
    <AdminTemplate>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Registro de Alertas
        </h2>
        <p className="text-gray-500">
          Historial y creación de nuevas alertas tempranas.
        </p>
      </div>
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          ></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-900">
          Módulo en Desarrollo
        </h3>
        <p className="text-gray-500 mt-1">
          El formulario de registro manual estará disponible próximamente.
        </p>
      </div>
    </AdminTemplate>
  );
};
