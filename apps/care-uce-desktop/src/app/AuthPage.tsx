import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Lock,
  Mail,
  Activity,
  AlertCircle,
  User,
  CreditCard,
} from 'lucide-react';
import authService from '../services/auth.service';

export const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        await authService.login(email, password);
      } else {
        // Ahora enviamos todos los datos al backend
        await authService.register(email, password, nombre, cedula);
      }
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar campos al cambiar entre Login y Registro
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg('');
    setNombre('');
    setCedula('');
    setPassword('');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* PANEL IZQUIERDO */}
      <div className="hidden md:flex w-1/2 bg-slate-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Activity
            size={800}
            className="absolute -top-32 -left-32 text-teal-500"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-teal-500 p-4 rounded-2xl mb-6 shadow-2xl">
            <Stethoscope size={64} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-wider mb-2">CareUCE</h1>
          <p className="text-teal-400 font-bold uppercase tracking-widest text-sm mb-6">
            Clinical Desktop Space
          </p>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed">
            Sistema de gestión clínica para profesionales de la salud. Acceso
            restringido exclusivamente al personal de Bienestar Estudiantil.
          </p>
        </div>
      </div>

      {/* PANEL DERECHO - Formulario Dinámico */}
      <div className="flex-1 flex items-center justify-center bg-white shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.1)] z-10 overflow-y-auto">
        <div className="w-full max-w-md p-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isLogin ? 'Bienvenido Dr.' : 'Registro Médico'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin
                ? 'Ingrese sus credenciales corporativas para acceder al sistema clínico.'
                : 'Cree una cuenta para el nuevo profesional de salud.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* CAMPOS EXCLUSIVOS DE REGISTRO */}
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-slate-800"
                      placeholder="Dr. Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Cédula
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-slate-800"
                      placeholder="17xxxxxxxx"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* CAMPOS COMUNES (Email y Password) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Correo Institucional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-slate-800"
                  placeholder="medico@uce.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50 text-slate-800"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:bg-teal-400 flex justify-center items-center gap-2 mt-2"
            >
              {isLoading
                ? 'Conectando con AWS...'
                : isLogin
                  ? 'Acceder al Sistema'
                  : 'Registrar Profesional'}
            </button>
          </form>

          {/* Toggle entre Login y Registro */}
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              {isLogin
                ? '¿Es personal nuevo?'
                : '¿Ya tiene cuenta corporativa?'}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-2 text-teal-600 font-bold hover:underline"
              >
                {isLogin ? 'Regístrese aquí' : 'Inicie Sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
