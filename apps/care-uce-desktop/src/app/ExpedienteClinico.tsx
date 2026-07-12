// Location: apps/care-uce-desktop/src/app/ExpedienteClinico.tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  AlertTriangle,
  FileDown,
} from 'lucide-react';
import { PatientRecord } from '../types/clinical';
import triageService from '../services/triage.service';

interface ExpedienteProps {
  paciente: PatientRecord;
  onVolver: () => void;
  isReadOnly?: boolean;
}

export const ExpedienteClinico: React.FC<ExpedienteProps> = ({
  paciente,
  onVolver,
  isReadOnly = false,
}) => {
  const [formData, setFormData] = useState({
    motivoConsulta: paciente.motivo || '',
    // 🔥 FIX: Replaced 'any' with a strict TypeScript Intersection Type
    sintomas: isReadOnly
      ? (paciente as PatientRecord & { notas?: string }).notas || ''
      : '',
    diagnostico: '',
    tratamiento: isReadOnly ? 'Caso Resuelto y Cerrado' : '',
    nivelRiesgo: paciente.prioridad || 'Media',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    setIsSaving(true);
    try {
      // Actually resolve the case in the backend database
      await triageService.resolveCase(paciente.id, formData.sintomas);
      alert(
        'Expediente clínico guardado exitosamente. El caso ha sido cerrado.',
      );
      onVolver(); // Returns to Dashboard and clears from UI
    } catch (error) {
      console.error('Failed to save clinical record:', error);
      alert('Error al guardar el expediente en la base de datos.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans print:bg-white print:p-0">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0 print:hidden">
        <div className="flex items-center gap-6">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              Expediente: {paciente.paciente}
              <span
                className={`text-xs px-2 py-1 rounded-md text-white font-bold uppercase tracking-wider ${
                  paciente.prioridad === 'Alta' ? 'bg-red-500' : 'bg-amber-500'
                }`}
              >
                Riesgo {paciente.prioridad}
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              ID Consulta: {paciente.id.substring(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            <FileDown size={18} /> Exportar PDF
          </button>
          {!isReadOnly && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Save size={18} />{' '}
              {isSaving ? 'Guardando...' : 'Guardar y Cerrar'}
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-0">
        <div className="max-w-5xl mx-auto space-y-6 print:max-w-full">
          <div className="hidden print:flex items-center justify-between border-b-2 border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                UNIVERSIDAD CENTRAL DEL ECUADOR
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ecosistema CareUCE — Historial Clínico Estudiantil
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                Fecha: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs font-medium text-slate-500">
                Documento Confidencial Protegido
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-6 print:border-none print:shadow-none print:p-0">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 shrink-0 print:hidden">
              <User size={32} />
            </div>
            <div className="flex-1 grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Nombre Completo
                </p>
                <p className="font-semibold text-slate-900 text-lg border-b border-slate-100 pb-1">
                  {paciente.paciente}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Edad Calculada
                </p>
                <p className="font-semibold text-slate-900 text-lg border-b border-slate-100 pb-1">
                  {paciente.edad} años
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Facultad / Carrera
                </p>
                <p
                  className="font-semibold text-slate-900 text-lg border-b border-slate-100 pb-1 truncate"
                  title={paciente.carrera}
                >
                  {paciente.carrera}
                </p>
              </div>
              <div className="col-span-3 pt-4 print:pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle
                    size={14}
                    className="text-amber-500 print:hidden"
                  />{' '}
                  Motivo de la Alerta de Triage
                </p>
                <p className="font-semibold text-slate-800 italic text-md bg-amber-50 p-3 rounded-lg border border-amber-100 print:bg-slate-50 print:border-slate-200">
                  "{paciente.motivo}"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2 print:bg-white print:px-0 print:border-b-2 print:border-slate-300">
              <FileText className="text-slate-500 print:hidden" size={20} />
              <h2 className="font-bold text-slate-800 uppercase tracking-wide text-sm">
                Anotaciones Médicas de Evolución
              </h2>
            </div>

            <div className="p-6 space-y-6 print:px-0 print:pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Síntomas y Observaciones Iniciales
                </label>
                <textarea
                  rows={4}
                  value={formData.sintomas}
                  readOnly={isReadOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, sintomas: e.target.value })
                  }
                  className={`w-full p-4 border border-slate-200 rounded-xl outline-none resize-none print:bg-white print:border-none print:p-0 print:text-slate-800 font-serif ${isReadOnly ? 'bg-white' : 'bg-slate-50 focus:ring-2 focus:ring-teal-500'}`}
                  placeholder="[Haga clic aquí para transcribir los síntomas de la evaluación clínica...]"
                />
              </div>

              {!isReadOnly && (
                <div className="grid grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Impresión Diagnóstica (CIE-10 / DSM-V)
                    </label>
                    <input
                      type="text"
                      value={formData.diagnostico}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          diagnostico: e.target.value,
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none print:bg-white print:border-none print:p-0 print:font-serif"
                      placeholder="Ej. F41.1 Trastorno de ansiedad generalizada"
                    />
                  </div>
                  <div className="print:hidden">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Re-evaluación del Nivel de Riesgo
                    </label>
                    <select
                      value={formData.nivelRiesgo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nivelRiesgo: e.target.value as
                            | 'Alta'
                            | 'Media'
                            | 'Baja',
                        })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="Alta">
                        Riesgo Alto (Crisis Activa / Derivación Inmediata)
                      </option>
                      <option value="Media">
                        Riesgo Medio (Seguimiento preventivo)
                      </option>
                      <option value="Baja">
                        Riesgo Bajo (Consulta regular)
                      </option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
