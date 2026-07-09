import { useState } from 'react';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import { OAuthButtons } from '../molecules/OAuthButtons';

// 1. Define the interface to strictly type the form data and eliminate 'any'
export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
  idCard?: string;
  confirmPassword?: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
  onToggleType: () => void;
  // 2. Replace 'any' with our new interface
  onSubmit: (formData: AuthFormData) => void;
  isLoading?: boolean;
  error?: string;
}

export const AuthForm = ({
  type,
  onToggleType,
  onSubmit,
  isLoading,
  error,
}: AuthFormProps) => {
  // 3. Map state variables exactly to match the backend DTO requirements
  const [formData, setFormData] = useState<AuthFormData>({
    fullName: '',
    idCard: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    onSubmit(formData); // Send structured data to the parent page
  };

  return (
    <div className="w-full p-8 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-[#003366]">
        {type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      {/* Attach handleSubmit to the form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <InputField
              label="Nombre Completo"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <InputField
              label="Cédula"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, idCard: e.target.value })
              }
            />
          </>
        )}

        <InputField
          label="Correo Institucional / Gmail"
          type="email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <InputField
          label="Contraseña"
          type="password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {/* 4. Add the Confirm Password input for registration */}
        {type === 'register' && (
          <InputField
            label="Confirmar Contraseña"
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        )}

        {/* Display error message if it exists */}
        {error && (
          <div className="text-red-500 text-sm font-semibold text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Submit button container */}
        <div className="mt-4">
          <Button
            label={
              isLoading
                ? 'Procesando...'
                : type === 'login'
                  ? 'Entrar'
                  : 'Registrarse'
            }
            className={`w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          />
        </div>
      </form>

      <OAuthButtons />

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">
          {type === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        </span>
        <button
          onClick={onToggleType}
          type="button"
          className="text-[#003366] font-bold hover:underline"
        >
          {type === 'login' ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </div>
    </div>
  );
};
