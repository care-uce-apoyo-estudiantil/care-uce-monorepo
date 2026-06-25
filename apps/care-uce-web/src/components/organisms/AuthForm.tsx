import { useState } from 'react';
import { InputField } from '../atoms/InputField';
import { Button } from '../atoms/Button';
import { OAuthButtons } from '../molecules/OAuthButtons';

interface AuthFormProps {
  type: 'login' | 'register';
  onToggleType: () => void;
}

export const AuthForm = ({ type, onToggleType }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    email: '',
    password: '',
  });

  return (
    <div className="w-full p-8 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-[#003366]">
        {type === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      <form className="space-y-4">
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

        <Button
          label={type === 'login' ? 'Entrar' : 'Registrarse'}
          className="w-full"
        />
      </form>

      <OAuthButtons />

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">
          {type === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        </span>
        <button
          onClick={onToggleType}
          className="text-[#003366] font-bold hover:underline"
        >
          {type === 'login' ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </div>
    </div>
  );
};
