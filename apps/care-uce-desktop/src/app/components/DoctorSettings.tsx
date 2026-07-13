// Location: apps/care-uce-desktop/src/app/components/DoctorSettings.tsx
import React, { useState, useEffect } from 'react';
import {
  Save,
  Award,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  BriefcaseMedical,
} from 'lucide-react';
import axios from 'axios';

const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3000/api';

export const DoctorSettings: React.FC = () => {
  const [specialty, setSpecialty] = useState<string>('Psicología Clínica');
  const [currentSpecialty, setCurrentSpecialty] =
    useState<string>('No asignada'); // Especialidad real actual
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [doctorEmail, setDoctorEmail] = useState<string>('');

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setDoctorEmail(user.email);
      if (user.specialty) {
        setSpecialty(user.specialty);
        setCurrentSpecialty(user.specialty);
      }
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorEmail) return;

    setIsSaving(true);
    setSuccessMessage('');

    try {
      await axios.patch(`${AUTH_API_URL}/auth/profile/specialty`, {
        email: doctorEmail,
        specialty: specialty,
      });

      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        user.specialty = specialty;
        localStorage.setItem('user', JSON.stringify(user));
      }

      setCurrentSpecialty(specialty);
      window.dispatchEvent(new Event('user-profile-updated'));

      setSuccessMessage(
        'Especialidad actualizada. El enrutamiento de citas ha sido redirigido.',
      );
    } catch (error) {
      alert('Error de conexión. Verifica que el auth-service esté corriendo.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans h-full overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-6">
        {/* ENCABEZADO CON LA ESPECIALIDAD ACTUAL */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <Award className="text-teal-600" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Perfil Profesional
              </h2>
              <p className="text-sm text-slate-500">
                Gestione su información para la asignación de pacientes.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Especialidad Actual
            </span>
            <div className="flex items-center gap-2 mt-1 text-teal-700 font-bold">
              <BriefcaseMedical size={16} />
              {currentSpecialty}
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-sm font-semibold rounded-r-lg flex items-center gap-2 shadow-sm">
            <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">
              Cambiar Especialidad Operativa
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Seleccione a qué área clínica será redirigido en el ecosistema
              móvil.
            </p>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              <option value="Psicología Clínica">
                Psicología Clínica (Bienestar Universitario)
              </option>
              <option value="Orientación Vocacional">
                Orientación Vocacional (Psicopedagogía)
              </option>
              <option value="Trabajo Social">
                Trabajo Social (Casos Vulnerables)
              </option>
            </select>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
            <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <p>
              <strong>Aviso de Enrutamiento Distribuido:</strong> Al modificar
              este campo, los estudiantes solo podrán reservarle citas bajo la
              nueva categoría seleccionada. Su agenda anterior podría ocultarse
              de las nuevas búsquedas.
            </p>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={isSaving || specialty === currentSpecialty} // Se deshabilita si elige la que ya tiene
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Sincronizando...' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
