// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { AuthForm } from '../components/organisms/AuthForm';

export const AuthPage: React.FC = () => {
  // Estado para saber si estamos en login o registro
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  
  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Función para cambiar entre Login y Registro
  const handleToggleType = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
    setError(''); // Limpiamos errores al cambiar de vista
  };

  // Función que recibe los datos desde el AuthForm y llama al backend
  const handleAuthSubmit = async (formData: any) => {
    setIsLoading(true);
    setError('');

    try {
      if (formType === 'login') {
        await authService.login(formData.email, formData.password);
      } else {
        // Asignamos 'student' por defecto, o puedes mapear el rol que necesites
        await authService.register(formData.email, formData.password, 'student');
      }
      
      // Si todo sale bien, lo disparamos al dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Aquí inyectamos tu Organismo exacto */}
        <AuthForm 
          type={formType}
          onToggleType={handleToggleType}
          onSubmit={handleAuthSubmit}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};