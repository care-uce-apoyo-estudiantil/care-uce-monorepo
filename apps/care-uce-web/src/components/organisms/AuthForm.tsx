// src/components/organisms/AuthForm.tsx
import { useState } from 'react';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import { OAuthButtons } from '../molecules/OAuthButtons';

interface AuthFormProps {
  type: 'login' | 'register';
  onToggleType: () => void;
  // Agregamos estas tres propiedades clave:
  onSubmit: (formData: any) => void;
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
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    onSubmit(formData); // Envía los datos a la página principal
  };

  return (
    <div className="w-full p-8 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-[#003366]">
        {type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      {/* Agregamos el evento onSubmit al form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <InputField
              label="Nombre Completo"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <InputField
              label="Cédula"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, cedula: e.target.value })
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

        {/* Mostrar mensaje de error si existe */}
        {error && (
          <div className="text-red-500 text-sm font-semibold text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Solo dejamos el div como un contenedor normal para el margen */}
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
