import { useState } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  UserCheck,
  Users,
  MoreVertical,
  Download,
} from 'lucide-react';

// --- DATOS SIMULADOS (MOCK) PARA LA PRESENTACIÓN ---
const MOCK_STUDENTS = [
  {
    id: 'UCE-001',
    name: 'Ana Paola Gómez',
    faculty: 'Ingeniería',
    risk: 'Crítico',
    status: 'Atención Requerida',
    date: '28 May 2026',
  },
  {
    id: 'UCE-002',
    name: 'Luis Fernando Pérez',
    faculty: 'Arquitectura',
    risk: 'Moderado',
    status: 'En Seguimiento',
    date: '25 May 2026',
  },
  {
    id: 'UCE-003',
    name: 'María José Torres',
    faculty: 'Ciencias Médicas',
    risk: 'Bajo',
    status: 'Estable',
    date: '20 May 2026',
  },
  {
    id: 'UCE-004',
    name: 'Carlos Eduardo Silva',
    faculty: 'Filosofía',
    risk: 'Crítico',
    status: 'Derivado a Psicología',
    date: '28 May 2026',
  },
  {
    id: 'UCE-005',
    name: 'Diana Estefanía Ruiz',
    faculty: 'Ingeniería',
    risk: 'Moderado',
    status: 'En Seguimiento',
    date: '15 May 2026',
  },
];

export const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Función sencilla para simular búsqueda en la presentación
  const filteredStudents = MOCK_STUDENTS.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.faculty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Estudiantes
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Panel de control administrativo e indicadores de riesgo poblacional.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm">
          <Download size={16} />
          Exportar Reporte (CQRS)
        </button>
      </div>

      {/* KPI CARDS (Tarjetas de Estadísticas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Población Evaluada
            </p>
            <h3 className="text-2xl font-bold text-gray-900">1,248</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg animate-pulse">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Riesgo Crítico Activo
            </p>
            <h3 className="text-2xl font-bold text-gray-900">42</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Casos Estabilizados
            </p>
            <h3 className="text-2xl font-bold text-gray-900">856</h3>
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o facultad..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
            <option>Nivel de Riesgo</option>
            <option>Crítico</option>
            <option>Moderado</option>
            <option>Bajo</option>
          </select>
          <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Facultad
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nivel de Riesgo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Última Alerta
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                        {student.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.faculty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        student.risk === 'Crítico'
                          ? 'bg-red-100 text-red-800'
                          : student.risk === 'Moderado'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {student.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {student.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación Simulada */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Mostrando {filteredStudents.length} de 1,248 registros
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Anterior
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-700 hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
