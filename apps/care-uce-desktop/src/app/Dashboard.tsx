// Location: apps/care-uce-desktop/src/app/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, FileText } from 'lucide-react';
import { ExpedienteClinico } from './ExpedienteClinico';
import { Sidebar } from '../components/Sidebar';
import { CrisisChat } from '../components/CrisisChat';
import { RecordsHistory } from '../components/RecordsHistory';
import { PatientRecord, DashboardView } from '../types/clinical';
import authService from '../services/auth.service';

// Mock active cases (Will be replaced by API call)
const ACTIVE_CASES: PatientRecord[] = [
  { id: 'EXP-1092', paciente: 'Ana Paola Gómez', edad: 21, carrera: 'Ing. Sistemas', motivo: 'Ataque de pánico', prioridad: 'Alta', tiempoEspera: '15 min' },
  { id: 'EXP-1088', paciente: 'Carlos Silva', edad: 23, carrera: 'Filosofía', motivo: 'Evaluación de seguimiento', prioridad: 'Media', tiempoEspera: '1 hora' },
];

export function Dashboard() {
  const navigate = useNavigate();
  
  // Navigation State
  const [activeView, setActiveView] = useState<DashboardView>('triage');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  
  // User State
  const [userEmail, setUserEmail] = useState('Doctor');

  // Load authenticated user data
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      // Safely parse user to avoid Linter any-type errors
      const user = JSON.parse(userString) as { email: string };
      setUserEmail(user.email);
    }
  }, []);

  // Secure sign out process
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Internal component: Triage Inbox (Kept here for direct data access before API integration)
  const renderTriageInbox = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b shrink-0">
        <h2 className="text-lg font-semibold text-slate-700">Active Triage Queue</h2>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patient..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50 text-slate-800"
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid gap-4">
          {ACTIVE_CASES.map((caso) => (
            <div key={caso.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-6">
                <div className={`w-3 h-16 rounded-full ${caso.prioridad === 'Alta' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-slate-800">{caso.paciente}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono border border-slate-200">{caso.id}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>{caso.edad} years</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{caso.carrera}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="font-medium text-slate-700 truncate max-w-xs">Reason: {caso.motivo}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 shrink-0">
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1 justify-end">
                    <Clock size={14} /> Wait Time
                  </p>
                  <p className={`font-bold ${caso.prioridad === 'Alta' ? 'text-red-600' : 'text-yellow-600'}`}>{caso.tiempoEspera}</p>
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
      </div>
    </div>
  );

  // Dynamic View Router
  const renderMainContent = () => {
    // If a patient is selected from Triage, show the PDF Exporter
    if (selectedPatient) {
      // Ensure tiempoEspera is a string to satisfy Paciente type expected by ExpedienteClinico
      const pacienteProp = { ...selectedPatient, tiempoEspera: selectedPatient.tiempoEspera ?? '' };
      return <ExpedienteClinico paciente={pacienteProp} onVolver={() => setSelectedPatient(null)} />;
    }

    // Otherwise, route by sidebar selection
    switch (activeView) {
      case 'triage': return renderTriageInbox();
      case 'records': return <RecordsHistory />;
      case 'chat': return <CrisisChat />;
      default: return renderTriageInbox();
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans w-full overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => {
          setActiveView(view);
          setSelectedPatient(null); // Reset selected patient on sidebar click
        }} 
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderMainContent()}
      </main>
    </div>
  );
}

export default Dashboard;