import React, { useRef, useState } from 'react';
import { ArrowLeft, Download, FileText, User, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export interface Paciente {
  id: string;
  paciente: string;
  edad: number;
  carrera: string;
  motivo: string;
  prioridad: string;
  tiempoEspera: string;
}

interface ExpedienteProps {
  paciente: Paciente;
  onVolver: () => void;
}

export const ExpedienteClinico: React.FC<ExpedienteProps> = ({
  paciente,
  onVolver,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const limpiarNombre = (str: string) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_');

  const handleExportPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      setIsGenerating(true);

      // 1. Tomamos la "foto" usando el motor nativo de Chromium
      const dataUrl = await toPng(element, {
        pixelRatio: 2, // Alta definición
        backgroundColor: '#ffffff', // Fondo blanco para evitar fondos transparentes/negros
      });

      // 2. Preparamos el documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // 3. Calculamos la altura matemáticamente perfecta para que no se deforme
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // 4. Inyectamos la imagen y descargamos
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Expediente_${paciente.id}_${limpiarNombre(paciente.paciente)}.pdf`,
      );
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('No se pudo descargar el PDF. Revisa la consola.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onVolver}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            disabled={isGenerating}
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-slate-800">
            Expediente Clínico: {paciente.id}
          </h2>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition-colors text-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download size={16} />
              Exportar a PDF
            </>
          )}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div
          ref={printRef}
          className="bg-white w-full max-w-4xl p-12 shadow-md border border-slate-200"
          style={{ minHeight: '1056px' }}
        >
          <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
                Universidad Central del Ecuador
              </h1>
              <p className="text-slate-600 font-medium">
                Dirección de Bienestar Estudiantil (CareUCE)
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Informe de Atención Psicológica / Trabajo Social
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">
                Fecha: {new Date().toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-slate-500 font-mono mt-1">
                Ref: {paciente.id}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <User size={18} className="text-teal-600" /> Datos de Filiación
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-semibold text-slate-600">Paciente:</span>{' '}
                {paciente.paciente}
              </p>
              <p>
                <span className="font-semibold text-slate-600">Edad:</span>{' '}
                {paciente.edad} años
              </p>
              <p>
                <span className="font-semibold text-slate-600">Carrera:</span>{' '}
                {paciente.carrera}
              </p>
              <p>
                <span className="font-semibold text-slate-600">
                  Estado de Triage:
                </span>{' '}
                <span className="text-red-600 font-bold">
                  {paciente.prioridad}
                </span>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-teal-600" /> Sintomatología
              Detectada
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded border border-slate-200">
              {paciente.motivo}
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-teal-600" /> Notas Clínicas de
              Evolución
            </h3>
            <textarea
              className="w-full p-4 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none min-h-[150px] bg-slate-50/30"
              placeholder="Describa el estado de salud mental, afectividad y nivel de riesgo actual..."
              defaultValue="El estudiante se presenta a la sesión con predisposición al diálogo. Manifiesta indicadores de ansiedad asociados a la carga evaluativa del periodo actual. Se aplican técnicas de contención y reestructuración cognitiva."
            ></textarea>
          </section>

          <div className="mt-32 pt-8 border-t border-slate-300 flex justify-around">
            <div className="text-center w-64">
              <div className="border-b border-slate-400 h-10 mb-2"></div>
              <p className="text-sm font-bold text-slate-800">
                Dr. Roberto Sánchez
              </p>
              <p className="text-xs text-slate-500">
                Psicólogo Clínico - Reg. MSP
              </p>
            </div>
            <div className="text-center w-64">
              <div className="border-b border-slate-400 h-10 mb-2"></div>
              <p className="text-sm font-bold text-slate-800">
                Firma del Estudiante
              </p>
              <p className="text-xs text-slate-500">Consentimiento Informado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
