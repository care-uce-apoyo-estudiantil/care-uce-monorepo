// Location: apps/care-uce-desktop/src/app/ExpedienteClinico.tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  User,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle,
  Activity,
} from 'lucide-react';
import triageService from '../services/triage.service';

interface PacienteProps {
  id: string;
  paciente: string;
  edad: number;
  carrera: string;
  motivo: string;
  prioridad: string;
  tiempoEspera: string;
}

interface Props {
  paciente: PacienteProps;
  onVolver: () => void;
}

export const ExpedienteClinico: React.FC<Props> = ({ paciente, onVolver }) => {
  const [notas, setNotas] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFinalizarAtencion = async () => {
    if (!notas.trim()) {
      alert('Por favor, ingresa las notas clínicas antes de finalizar.');
      return;
    }
    setIsSaving(true);
    try {
      // Mandamos la orden al backend para resolver el caso de emergencia
      await triageService.resolveCase(paciente.id, notas);
      // Al volver al Dashboard, se refrescará y el paciente ya no estará en la cola
      onVolver();
    } catch {
      alert('Error al guardar el expediente.');
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white px-8 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Atención de Crisis (Triage)
            </h2>
            <p className="text-sm text-slate-500 font-mono">
              ID: {paciente.id.substring(0, 12)}...
            </p>
          </div>
        </div>
        <button
          onClick={handleFinalizarAtencion}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white shadow-sm transition-colors ${isSaving ? 'bg-slate-400' : 'bg-teal-600 hover:bg-teal-700'}`}
        >
          {isSaving ? (
            <Activity className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {isSaving ? 'Guardando...' : 'Finalizar y Guardar'}
        </button>
      </header>

      <div className="p-8 max-w-6xl mx-auto w-full grid grid-cols-3 gap-8 overflow-y-auto">
        {/* Lado Izquierdo: Info del Paciente */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 uppercase">
              {paciente.paciente.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-800 capitalize">
              {paciente.paciente}
            </h3>
            <p className="text-slate-500 mb-6">{paciente.carrera}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <User size={18} className="text-slate-400" />
                <span className="text-slate-700 font-medium">
                  {paciente.edad} años
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={18} className="text-slate-400" />
                <span className="text-slate-700 font-medium">
                  Prioridad:{' '}
                  <span className="text-red-600 font-bold">
                    {paciente.prioridad}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertTriangle
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <span className="text-red-700 font-medium leading-relaxed">
                  Motivo: {paciente.motivo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Formulario Clínico */}
        <div className="col-span-2">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <FileText size={20} className="text-teal-600" /> Notas de
              Evolución / Contención
            </h3>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Redacte aquí la evaluación psicológica, estado mental del paciente, acciones tomadas para la contención emocional y las recomendaciones de seguimiento..."
              className="w-full flex-1 min-h-[350px] p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none text-slate-700 leading-relaxed text-base"
            ></textarea>
            <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm border border-blue-100">
              <CheckCircle size={20} className="shrink-0 text-blue-600" />
              <p>
                Al hacer clic en "Finalizar y Guardar", este caso se marcará
                como <strong>Resuelto</strong> en la base de datos y saldrá de
                la bandeja de emergencias activas. Asegúrese de que el
                estudiante se encuentre estabilizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
