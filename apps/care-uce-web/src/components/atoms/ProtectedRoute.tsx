import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Revisamos si existe el token en la memoria del navegador
  const token = localStorage.getItem('auth_token');

  // Si no hay token, lo mandamos directo al login sin preguntar
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // Si hay token, lo dejamos pasar al componente que pidió
  return <>{children}</>;
};
