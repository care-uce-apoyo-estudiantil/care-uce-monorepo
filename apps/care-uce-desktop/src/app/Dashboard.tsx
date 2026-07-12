// Location: apps/care-uce-desktop/src/app/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, FileText, Activity } from 'lucide-react';
import { ExpedienteClinico } from './ExpedienteClinico';
import { Sidebar } from './components/Sidebar';
import { CrisisChat } from './components/CrisisChat';
import { RecordsHistory } from './components/RecordsHistory';
import { Appointments } from './components/Appointments';
import { PatientRecord, DashboardView } from '../types/clinical';
import authService from '../services/auth.service';
import triageService from '../services/triage.service';

export function Dashboard() {
  const navigate = useNavigate();

  // Navigation & Data State
  const [activeView, setActiveView] = useState<DashboardView>('triage');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(
    null,
  );
  const [activeCases, setActiveCases] = useState<PatientRecord[]>([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);

  // User Profile Name State
  const [userName, setUserName] = useState('');

  // Load authenticated user data showing the real name
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString) as { nombre: string; email?: string };
      // Mostramos el Nombre. Si no existe, caemos en el email.
      setUserName(user.nombre || user.email || 'Doctor Profesional');
    }
  }, []);

  // Fetch Real Triage Cases from Backend
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const cases = await triageService.getActiveCases();
        setActiveCases(cases);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingCases(false);
      }
    };

    fetchCases(); // Initial fetch

    // Polling: Check for new panic button alerts every 5 seconds
    const interval = setInterval(fetchCases, 5000);
    return () => clearInterval(interval);
  }, []);

  // Secure sign out
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Internal component: Real-Time Triage Inbox
  const renderTriageInbox = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-700">
            Active Triage Queue
          </h2>
          {/* Animated pulse dot if there are active cases */}
          {activeCases.length > 0 && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search patient..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50 text-slate-800"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {isLoadingCases ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <Activity className="animate-spin text-teal-500" size={48} />
            <p>Loading clinical queue...</p>
          </div>
        ) : activeCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
            <Activity size={48} opacity={0.5} />
            <p className="text-lg">
              No active emergencies. The queue is clear.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeCases.map((caso) => (
              <div
                key={caso.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-3 h-16 rounded-full ${caso.prioridad === 'Alta' ? 'bg-red-500' : 'bg-yellow-400'}`}
                  ></div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-slate-800">
                        {caso.paciente}
                      </h3>
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono border border-slate-200">
                        {caso.id.substring(0, 8).toUpperCase()}...
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{caso.edad} years</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{caso.carrera}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="font-medium text-slate-700 truncate max-w-xs">
                        Reason: {caso.motivo}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1 justify-end">
                      <Clock size={14} /> Wait Time
                    </p>
                    <p
                      className={`font-bold ${caso.prioridad === 'Alta' ? 'text-red-600' : 'text-yellow-600'}`}
                    >
                      {caso.tiempoEspera}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(caso)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
                  >
                    <FileText size={18} /> Open Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderMainContent = () => {
    if (selectedPatient) {
      const pacienteProp = {
        id: selectedPatient.id,
        paciente: selectedPatient.paciente,
        edad: selectedPatient.edad,
        carrera: selectedPatient.carrera,
        motivo: selectedPatient.motivo,
        prioridad: selectedPatient.prioridad,
        tiempoEspera: selectedPatient.tiempoEspera ?? 'N/A',
      };
      return (
        <ExpedienteClinico
          paciente={pacienteProp}
          onVolver={() => setSelectedPatient(null)}
        />
      );
    }

    switch (activeView) {
      case 'triage':
        return renderTriageInbox();
      case 'appointments':
        return <Appointments />;
      case 'records':
        return <RecordsHistory />;
      case 'chat':
        return <CrisisChat />;
      default:
        return renderTriageInbox();
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans w-full overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedPatient(null);
        }}
        onLogout={handleLogout}
        userName={userName}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default Dashboard;
