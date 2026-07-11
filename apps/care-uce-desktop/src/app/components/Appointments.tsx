// Location: apps/care-uce-desktop/src/app/components/Appointments.tsx
import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  XCircle,
  FileText,
  CheckCircle,
  RefreshCw,
  Lock,
  Unlock,
  CalendarDays,
} from 'lucide-react';
import appointmentService, {
  AppointmentRecord,
} from '../../services/appointment.service';

// 🔥 Motor de tiempo: Obtener HOY + los próximos 4 días hábiles (5 en total)
const getWorkDaysWindow = () => {
  const dates = [];
  const current = new Date();
  while (dates.length < 5) {
    const day = current.getDay();
    // 0 = Domingo, 6 = Sábado
    if (day !== 0 && day !== 6) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Días válidos y Estado de fecha seleccionada
  const workDays = getWorkDaysWindow();
  const [selectedDate, setSelectedDate] = useState<Date>(workDays[0]); // Por defecto: Hoy (o el primer día hábil)

  const doctorName = 'Juan Perez';

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // Traemos TODO, y luego el frontend filtra por día
      const data =
        await appointmentService.getMyUpcomingAppointments(doctorName);
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleRevoke = async (id: string) => {
    if (
      window.confirm('¿Estás seguro de que deseas revocar/liberar esta cita?')
    ) {
      try {
        await appointmentService.changeStatus(id, 'Cancelled');
        fetchAppointments();
      } catch {
        alert('Error al procesar la solicitud.');
      }
    }
  };

  // 🔥 Adaptamos la función para que use la fecha seleccionada en el carrusel
  const getSlotDate = (timeStr: string) => {
    const cleanTime = timeStr.replace(' (Almuerzo)', '');
    const [time, modifier] = cleanTime.split(' ');
    const [hours, minutes] = time.split(':');
    let hr = parseInt(hours, 10);
    if (hr === 12 && modifier === 'AM') hr = 0;
    if (hr !== 12 && modifier === 'PM') hr += 12;

    const date = new Date(selectedDate);
    date.setHours(hr, parseInt(minutes, 10), 0, 0);
    return date;
  };

  const handleToggleBlock = async (
    slotTime: string,
    existingApt?: AppointmentRecord,
  ) => {
    try {
      if (existingApt && existingApt.studentName === '__BLOCKED__') {
        await appointmentService.changeStatus(existingApt.id, 'Cancelled');
      } else if (!existingApt) {
        const slotDate = getSlotDate(slotTime);
        await appointmentService.blockTimeSlot(doctorName, slotDate);
      }
      fetchAppointments();
    } catch {
      alert('Error actualizando disponibilidad.');
    }
  };

  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM (Almuerzo)',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  // 🔥 Filtramos las citas para mostrar SOLO las del día seleccionado en el panel
  const appointmentsForSelectedDate = appointments.filter((apt) => {
    const d = new Date(apt.scheduledAt);
    return (
      d.getDate() === selectedDate.getDate() &&
      d.getMonth() === selectedDate.getMonth()
    );
  });

  const realPatients = appointmentsForSelectedDate.filter(
    (apt) => apt.studentName !== '__BLOCKED__',
  );

  return (
    <div className="flex h-full bg-slate-50">
      {/* Columna Izquierda: Disponibilidad */}
      <div className="w-1/3 bg-white border-r border-slate-200 p-8 overflow-y-auto flex flex-col">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <CalendarIcon className="text-teal-600" /> Mi Agenda
        </h2>

        {/* Selector de Días Hábiles */}
        <div
          className="flex gap-2 overflow-x-auto pb-4 mb-4 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {workDays.map((date, idx) => {
            const isSelected = selectedDate.getDate() === date.getDate();
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`min-w-[70px] p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-teal-600 border-teal-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-teal-400'
                }`}
              >
                <div className="text-[10px] uppercase font-bold opacity-80">
                  {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                </div>
                <div className="text-lg font-black">{date.getDate()}</div>
              </button>
            );
          })}
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Bloquea o libera horarios para el día seleccionado.
        </p>

        <div className="space-y-3 flex-1 overflow-y-auto pr-2">
          {timeSlots.map((slot, index) => {
            const isLunch = slot.includes('Almuerzo');
            const slotDate = getSlotDate(slot);

            const existingApt = appointmentsForSelectedDate.find((apt) => {
              const d = new Date(apt.scheduledAt);
              return d.getHours() === slotDate.getHours();
            });

            let status = 'Libre';
            if (isLunch) status = 'Almuerzo';
            else if (existingApt) {
              status =
                existingApt.studentName === '__BLOCKED__'
                  ? 'Bloqueado'
                  : 'Reservado';
            }

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  status === 'Almuerzo'
                    ? 'bg-slate-100 border-slate-200 text-slate-400'
                    : status === 'Reservado'
                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                      : status === 'Bloqueado'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-white border-slate-200 hover:border-teal-400 cursor-pointer'
                }`}
                onClick={() => {
                  if (status === 'Libre' || status === 'Bloqueado') {
                    handleToggleBlock(slot, existingApt);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Clock
                    size={16}
                    className={
                      status === 'Almuerzo'
                        ? 'text-slate-400'
                        : 'text-slate-700'
                    }
                  />
                  <span
                    className={`font-semibold text-sm ${status === 'Almuerzo' && 'italic'}`}
                  >
                    {slot}
                  </span>
                </div>

                {status === 'Libre' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    <Unlock size={12} /> Libre
                  </span>
                )}
                {status === 'Bloqueado' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    <Lock size={12} /> No Disp.
                  </span>
                )}
                {status === 'Reservado' && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    <User size={12} /> Ocupado
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Columna Derecha: Citas Agendadas */}
      <div className="w-2/3 p-8 overflow-y-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarDays className="text-slate-400" /> Citas:{' '}
              {selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h2>
            <p className="text-slate-500 mt-1">
              Gestión de pacientes para el día seleccionado.
            </p>
          </div>
          <button
            onClick={fetchAppointments}
            className="flex items-center gap-2 text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />{' '}
            Refrescar
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-slate-400">
            Cargando agenda...
          </div>
        ) : realPatients.length === 0 ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-12 text-center">
            <CheckCircle className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-700">
              Agenda Despejada
            </h3>
            <p className="text-slate-500 mt-2">
              No tienes pacientes agendados para este día.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {realPatients.map((apt) => {
              const aptDate = new Date(apt.scheduledAt);
              return (
                <div
                  key={apt.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xl uppercase shrink-0">
                      {apt.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 capitalize">
                        {apt.studentName}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={14} /> {apt.studentEmail}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          <Clock size={14} />{' '}
                          {aptDate.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRevoke(apt.id)}
                      className="text-sm font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <XCircle size={16} /> Revocar
                    </button>
                    <button
                      onClick={() =>
                        alert(
                          'Módulo de Expedientes Clínicos en construcción...',
                        )
                      }
                      className="text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 px-5 py-2.5 rounded-lg transition-all flex items-center gap-2"
                    >
                      <FileText size={16} /> Iniciar Sesión
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
