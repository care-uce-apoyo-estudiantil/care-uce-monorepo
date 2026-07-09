import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { AuthForm, AuthFormData } from '../components/organisms/AuthForm';

export const AuthPage: React.FC = () => {
  // State to track whether we are in login or register mode
  const [formType, setFormType] = useState<'login' | 'register'>('login');

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Function to toggle between Login and Registration views
  const handleToggleType = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
    setError(''); // Clear errors when switching views
  };

  // Function that receives structured data from AuthForm and calls the backend
  // Replaced 'any' with 'AuthFormData'
  const handleAuthSubmit = async (formData: AuthFormData) => {
    setIsLoading(true);
    setError('');

    try {
      if (formType === 'login') {
        await authService.login(formData.email, formData.password);
      } else {
        // Send the entire formData object directly to the service
        // Do not pass the role manually, the backend handles it via headers
        await authService.register(formData);
      }

      // If successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      // Replaced 'any' with 'unknown' for strict typing
      if (err instanceof Error) {
        setError(err.message || 'Server connection error.');
      } else {
        setError('An unexpected error occurred.');
      }
      console.error(err);
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
