import { Bell, ShieldAlert, CheckCircle, Clock, Activity } from 'lucide-react';

const MOCK_ALERTS = [
  {
    id: 'EVT-7701',
    type: 'Crisis Psicológica',
    severity: 'High',
    status: 'Atendido',
    time: '10:45 AM',
  },
  {
    id: 'EVT-7702',
    type: 'Intento de Deserción',
    severity: 'Medium',
    status: 'Pendiente',
    time: '11:15 AM',
  },
  {
    id: 'EVT-7703',
    type: 'Emergencia Médica',
    severity: 'Critical',
    status: 'En Proceso',
    time: '12:02 PM',
  },
];

export const AlertsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Monitoreo de Alertas (Event Bus)
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Visualización en tiempo real de eventos críticos del sistema
          distribuido.
        </p>
      </div>

      {/* MÉTRICAS DE ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm flex items-center justify-between">
          <span className="text-red-600 font-bold">Críticas: 12</span>
          <ShieldAlert size={20} className="text-red-500" />
        </div>
        <div className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm flex items-center justify-between">
          <span className="text-yellow-600 font-bold">Pendientes: 5</span>
          <Clock size={20} className="text-yellow-500" />
        </div>
        <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm flex items-center justify-between">
          <span className="text-green-600 font-bold">Resueltas: 140</span>
          <CheckCircle size={20} className="text-green-500" />
        </div>
        <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm flex items-center justify-between">
          <span className="text-blue-600 font-bold">Actividad: Normal</span>
          <Activity size={20} className="text-blue-500" />
        </div>
      </div>

      {/* LISTA DE EVENTOS */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold mb-4">Log de Eventos Recientes</h2>
        <div className="space-y-4">
          {MOCK_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border-l-4 border-l-red-500"
            >
              <div className="flex items-center gap-4">
                <Bell className="text-red-500" size={20} />
                <div>
                  <p className="font-semibold text-sm">{alert.type}</p>
                  <p className="text-xs text-gray-500">ID Evento: {alert.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${alert.status === 'Atendido' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                >
                  {alert.status}
                </span>
                <span className="text-xs text-gray-400">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
