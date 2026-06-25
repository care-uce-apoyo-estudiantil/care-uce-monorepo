import React, { useState } from 'react';
import { AdminTemplate } from '../components/templates/AdminTemplate';

export const DashboardPage: React.FC = () => {
  // 1. Convertimos los números quemados en "Estados" vivos
  const [alertasCriticas, setAlertasCriticas] = useState(3);
  const [intervenciones, setIntervenciones] = useState(128);
  
  // 2. Metemos los datos de la tabla en un array manejable
  const [casosPendientes, setCasosPendientes] = useState([
    { id: 'EST-2026-8901', nivel: 'Riesgo Alto', fecha: '24 Jun 2026', color: 'bg-red-100 text-red-700' },
    { id: 'EST-2026-8944', nivel: 'Riesgo Medio', fecha: '23 Jun 2026', color: 'bg-yellow-100 text-yellow-700' }
  ]);

  // 3. La función mágica de la presentación
  const handleAtenderCaso = (id: string) => {
    // Quitamos al estudiante de la tabla
    setCasosPendientes(casosPendientes.filter(caso => caso.id !== id));
    // Bajamos el contador de alertas
    setAlertasCriticas(prev => prev > 0 ? prev - 1 : 0);
    // Subimos el éxito de intervenciones
    setIntervenciones(prev => prev + 1);
  };

  return (
    <AdminTemplate>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Resumen Operativo</h2>
        <p className="text-gray-500">Monitoreo de estado de la comunidad estudiantil.</p>
      </div>

      {/* Tarjetas de Estadísticas Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500 transition-all">
          <h3 className="text-red-500 text-xs font-bold uppercase tracking-wide">Alertas Críticas Activas</h3>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{alertasCriticas}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <h3 className="text-yellow-500 text-xs font-bold uppercase tracking-wide">Casos en Seguimiento</h3>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">14</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 transition-all">
          <h3 className="text-green-500 text-xs font-bold uppercase tracking-wide">Intervenciones Exitosas</h3>
          <p className="text-4xl font-extrabold text-gray-800 mt-2">{intervenciones}</p>
        </div>
      </div>

      {/* Tabla Dinámica */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Alertas Recientes - Ingeniería en Sistemas</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b">
            <tr>
              <th className="px-6 py-4">Identificador</th>
              <th className="px-6 py-4">Nivel de Riesgo</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4 text-right">Acción Rápida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {casosPendientes.length > 0 ? (
              casosPendientes.map((caso) => (
                <tr key={caso.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{caso.id}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${caso.color}`}>
                      {caso.nivel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{caso.fecha}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleAtenderCaso(caso.id)}
                      className="bg-[#003366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors"
                    >
                      Tomar Caso
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 italic">
                  No hay alertas críticas pendientes en este momento. ¡Excelente trabajo!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminTemplate>
  );
};