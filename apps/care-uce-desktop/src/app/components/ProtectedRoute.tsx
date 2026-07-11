// Location: apps/care-uce-desktop/src/app/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Higher Order Component to protect routes that require authentication
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('auth_token');

  // If no JWT token is found in local storage, redirect to the login screen
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the requested component
  return <>{children}</>;
};
