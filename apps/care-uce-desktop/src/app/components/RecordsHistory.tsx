// Location: apps/care-uce-desktop/src/app/components/RecordsHistory.tsx
import React from 'react';
import { Search, Download, Eye } from 'lucide-react';
import { PatientRecord } from '../../types/clinical';

// Mock data to simulate historical records
const PAST_RECORDS: PatientRecord[] = [
  {
    id: 'EXP-0950',
    paciente: 'Luis Morales',
    edad: 22,
    carrera: 'Architecture',
    motivo: 'Anxiety',
    prioridad: 'Media',
    estado: 'Completado',
    fechaAtencion: '2026-06-15',
  },
  {
    id: 'EXP-0941',
    paciente: 'Sofia Castro',
    edad: 19,
    carrera: 'Law',
    motivo: 'Depression screening',
    prioridad: 'Alta',
    estado: 'Derivado',
    fechaAtencion: '2026-06-10',
  },
];

export const RecordsHistory: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b shrink-0">
        <h2 className="text-lg font-semibold text-slate-700">
          Clinical History Repository
        </h2>
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by ID or Patient Name..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50 text-slate-800"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-xs">
              <tr>
                <th className="px-6 py-4">Expedient ID</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PAST_RECORDS.map((record) => (
                <tr
                  key={record.id}
                  className="border-b last:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-teal-700">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {record.paciente}
                  </td>
                  <td className="px-6 py-4">{record.fechaAtencion}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${record.estado === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                    >
                      {record.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
