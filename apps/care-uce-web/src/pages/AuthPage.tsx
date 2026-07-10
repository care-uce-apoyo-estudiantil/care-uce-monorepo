// Location: apps/care-uce-web/src/pages/AuthPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { AuthForm, AuthFormData } from '../components/organisms/AuthForm';

export const AuthPage: React.FC = () => {
  // State to track whether we are in login or register mode
  const [formType, setFormType] = useState<'login' | 'register'>('login');

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  // Function to toggle between Login and Registration views
  const handleToggleType = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
    setError(''); // Clear errors when switching views
  };

  // 1. Tipamos estrictamente el formData y quitamos el 'any'
  const handleAuthSubmit = async (formData: AuthFormData) => {
    setIsLoading(true);
    setError(''); // 2. Usamos '' en lugar de null para respetar el tipado

    try {
      // 3. Corregimos 'type' por 'formType' (el nombre de tu variable de estado)
      if (formType === 'login') {
        // En el login solo mandamos email y password
        await authService.login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        // En el registro mandamos el formData completo
        await authService.register(formData);
        alert('Administrador registrado con éxito. Inicie sesión.');
        // 4. Corregimos 'setType' por 'setFormType'
        setFormType('login');
      }
    } catch (err: unknown) {
      // 5. Eliminamos el 'err: any' usando unknown y verificando si es una instancia de Error
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error de autenticación inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        {/* Inject the strictly typed AuthForm */}
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
