// Location: apps/care-uce-web/src/pages/StudentsPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Users,
  AlertTriangle,
  UserCheck,
  Activity,
} from 'lucide-react';
// 🔥 FIX: Correctly imported from triage.service instead of admin.service
import webTriageService, { WebTriageEntity } from '../services/triage.service';

export const StudentsPage: React.FC = () => {
  const [dataset, setDataset] = useState<WebTriageEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch real clinical data on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const data = await webTriageService.getAllTriageEvents();
        setDataset(data);
      } catch (error) {
        console.error('Failed to load dashboard statistics', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Real-time KPI calculations based on live database status
  const totalEvaluated = dataset.length;
  const criticalRiskCount = dataset.filter(
    (item) => item.priorityLevel === 'Alta' && item.caseStatus === 'Pendiente',
  ).length;
  const stabilizedCount = dataset.filter(
    (item) => item.caseStatus === 'Resuelto',
  ).length;

  // Search filter logic
  const filteredStudents = dataset.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.academicMajor.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden font-sans">
      {/* Header Context */}
      <div className="px-8 py-6 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Gestión de Estudiantes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Panel de control administrativo e indicadores de riesgo poblacional.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors bg-white shadow-sm">
          <Download size={16} /> Exportar Reporte (CQRS)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* KPI Analytics Cards */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Total Población Evaluada
                </p>
                <p className="text-3xl font-black text-slate-800">
                  {isLoading ? '-' : totalEvaluated}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Riesgo Crítico Activo
                </p>
                <p className="text-3xl font-black text-slate-800">
                  {isLoading ? '-' : criticalRiskCount}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Casos Estabilizados
                </p>
                <p className="text-3xl font-black text-slate-800">
                  {isLoading ? '-' : stabilizedCount}
                </p>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <div className="relative w-96">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre o facultad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">Nivel de Riesgo</option>
                  <option value="high">Crítico</option>
                  <option value="moderate">Moderado</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium">
                  <Filter size={16} /> Filtros
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                <Activity
                  className="animate-spin text-blue-500 mb-4"
                  size={32}
                />
                <p>Sincronizando Data Warehouse...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Estudiante</th>
                    <th className="px-6 py-4">Facultad</th>
                    <th className="px-6 py-4">Nivel de Riesgo</th>
                    <th className="px-6 py-4">Estado Actual</th>
                    <th className="px-6 py-4">Última Alerta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                            {item.patientName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {item.patientName}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              UID-{item.id.substring(0, 6).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {item.academicMajor}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            item.priorityLevel === 'Alta'
                              ? 'bg-red-100 text-red-700'
                              : item.priorityLevel === 'Media'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.priorityLevel === 'Alta'
                            ? 'Crítico'
                            : item.priorityLevel === 'Media'
                              ? 'Moderado'
                              : 'Bajo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-bold ${item.caseStatus === 'Resuelto' ? 'text-emerald-600' : 'text-slate-600'}`}
                        >
                          {item.caseStatus === 'Pendiente'
                            ? 'Atención Requerida'
                            : item.caseStatus === 'En Proceso'
                              ? 'En Seguimiento'
                              : 'Estable / Alta'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {new Date(item.createdAt).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No se encontraron registros en la base de datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
