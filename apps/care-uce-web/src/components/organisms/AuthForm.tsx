// Location: apps/care-uce-web/src/components/organisms/AuthForm.tsx
import { useState } from 'react';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import { OAuthButtons } from '../molecules/OAuthButtons';

// 1. Interfaz estricta mapeada a las exigencias del Backend (DTO)
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
  const [formData, setFormData] = useState<AuthFormData>({
    fullName: '',
    idCard: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de contraseñas directo en el formulario antes de mandar al backend
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor verifica.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="w-full p-8 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-[#003366]">
        {type === 'login'
          ? 'Acceso Administrativo'
          : 'Crear Cuenta Administrador'}
      </h2>
      <p className="text-slate-500 mb-6 text-sm">
        {type === 'login'
          ? 'Portal exclusivo para personal autorizado CareUCE.'
          : 'Complete sus datos institucionales.'}
      </p>

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
                // Evitamos letras en la cédula desde el UI
                setFormData({
                  ...formData,
                  idCard: e.target.value.replace(/[^0-9]/g, ''),
                })
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

        {/* Campo Confirmar Contraseña para el Registro */}
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
          <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm font-semibold animate-pulse rounded-r-md">
            {error}
          </div>
        )}

        {/* Submit button container */}
        <div className="mt-4">
          {/* Ojo: Asumimos que tu <Button> hace "submit" si está dentro de un <form>.
              Si tu <Button> de átomos es type="button" por defecto, cámbialo a type="submit" en el átomo. */}
          <Button
            label={
              isLoading
                ? 'Procesando...'
                : type === 'login'
                  ? 'Entrar'
                  : 'Registrar Administrador'
            }
            className={`w-full py-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          />
        </div>
      </form>

      <OAuthButtons />

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">
          {type === 'login'
            ? '¿No tienes cuenta? '
            : '¿Ya tienes cuenta aprobada? '}
        </span>
        <button
          onClick={onToggleType}
          type="button"
          className="text-[#003366] font-bold hover:underline ml-1"
        >
          {type === 'login' ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </div>
    </div>
  );
};
