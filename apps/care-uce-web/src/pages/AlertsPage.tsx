// Location: apps/care-uce-web/src/pages/AlertsPage.tsx
import React, { useState, useEffect } from 'react';
import { Activity, Clock, AlertCircle, AlertTriangle } from 'lucide-react';
// 🔥 FIX: Correctly imported from triage.service instead of admin.service
import webTriageService, { WebTriageEntity } from '../services/triage.service';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<WebTriageEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real clinical data on component mount
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        // We only want the active/unresolved alerts for the live monitor
        const data = await webTriageService.getAllTriageEvents();
        const activeAlerts = data.filter(
          (item) => item.caseStatus === 'Pendiente',
        );
        setAlerts(activeAlerts);
      } catch (error) {
        console.error('Failed to load active alerts', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden font-sans">
      <div className="px-8 py-6 bg-white border-b border-slate-200 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">
          Monitor de Alertas Activas
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visualización en tiempo real de las emergencias clínicas sin resolver.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400">
              <Activity className="animate-spin text-red-500 mb-4" size={32} />
              <p>Sincronizando red de telemetría...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-sm">
              <AlertCircle className="text-slate-300 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold text-slate-700">
                Sistema Seguro
              </h3>
              <p className="text-slate-500">
                No hay alertas de riesgo crítico activas en la universidad.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {alert.patientName}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 mb-2">
                      {alert.academicMajor}
                    </p>
                    <div className="bg-amber-50 px-4 py-3 rounded-lg border border-amber-100">
                      <p className="text-sm text-slate-700 italic">
                        "{alert.crisisReason}"
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-400 uppercase flex items-center justify-end gap-1 mb-1">
                    <Clock size={14} /> Tiempo de emisión
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    {new Date(alert.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
