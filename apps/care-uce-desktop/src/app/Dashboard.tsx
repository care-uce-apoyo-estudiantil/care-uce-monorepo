import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  ClipboardList,
  AlertCircle,
  Clock,
  Search,
  FileText,
  LogOut,
} from 'lucide-react';
import { ExpedienteClinico, Paciente } from './ExpedienteClinico';
import authService from '../services/auth.service';

const CASOS_ASIGNADOS = [
  {
    id: 'EXP-1092',
    paciente: 'Ana Paola Gómez',
    edad: 21,
    carrera: 'Ing. Sistemas',
    motivo: 'Ataque de pánico recurrentes en época de exámenes',
    prioridad: 'Alta',
    tiempoEspera: '15 min',
  },
  {
    id: 'EXP-1088',
    paciente: 'Carlos Silva',
    edad: 23,
    carrera: 'Filosofía',
    motivo: 'Evaluación de seguimiento por cuadro depresivo',
    prioridad: 'Media',
    tiempoEspera: '1 hora',
  },
  {
    id: 'EXP-1075',
    paciente: 'María Torres',
    edad: 20,
    carrera: 'Medicina',
    motivo: 'Estrés académico agudo, ideación de abandono de carrera',
    prioridad: 'Alta',
    tiempoEspera: '20 min',
  },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<Paciente | null>(null);

  // Estado para guardar el correo del usuario logueado
  const [userEmail, setUserEmail] = useState('Doctor');

  // Al cargar el Dashboard, leemos quién inició sesión desde el localStorage
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setUserEmail(user.email);
    }
  }, []);

  // Función para cerrar sesión de forma segura
  const handleLogout = () => {
    authService.logout(); // Borra el token y los datos
    navigate('/login'); // Te patea a la pantalla de inicio
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans w-full">
      {/* SIDEBAR CLÍNICO */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <Stethoscope className="text-teal-400" size={28} />
          <div>
            <h1 className="text-xl font-bold tracking-wide">CareUCE</h1>
            <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
              Clinical Space
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => setPacienteSeleccionado(null)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${!pacienteSeleccionado ? 'bg-teal-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
          >
            <AlertCircle size={20} /> Bandeja de Triage
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <ClipboardList size={20} /> Mis Expedientes
          </button>
        </nav>

        {/* ÁREA DE USUARIO Y BOTÓN DE LOGOUT */}
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-lg shrink-0 uppercase">
              {/* Toma la primera letra del correo para el avatar */}
              {userEmail.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate" title={userEmail}>
                {userEmail}
              </p>
              <p className="text-xs text-slate-400">Psicología Clínica</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-bold shadow-sm"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DINÁMICA */}
      {pacienteSeleccionado ? (
        <ExpedienteClinico
          paciente={pacienteSeleccionado}
          onVolver={() => setPacienteSeleccionado(null)}
        />
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 border-b shrink-0">
            <h2 className="text-lg font-semibold text-slate-700">
              Pacientes Asignados (Turnos Activos)
            </h2>
            <div className="relative w-72">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50 text-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="grid gap-4">
              {CASOS_ASIGNADOS.map((caso) => (
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
                          {caso.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{caso.edad} años</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{caso.carrera}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="font-medium text-slate-700 truncate max-w-xs">
                          Motivo: {caso.motivo}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1 justify-end">
                        <Clock size={14} /> Espera
                      </p>
                      <p
                        className={`font-bold ${caso.prioridad === 'Alta' ? 'text-red-600' : 'text-yellow-600'}`}
                      >
                        {caso.tiempoEspera}
                      </p>
                    </div>
                    <button
                      onClick={() => setPacienteSeleccionado(caso)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-colors flex items-center gap-2"
                    >
                      <FileText size={18} /> Abrir Expediente
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Dashboard;
