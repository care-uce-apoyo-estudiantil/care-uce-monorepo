// Location: apps/care-uce-desktop/src/app/components/Appointments.tsx
import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, AlertCircle } from 'lucide-react';
import { Appointment } from '../../types/clinical';

// Mock data (Will be replaced by API call to NestJS)
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-001',
    patientName: 'Ana Paola Gómez',
    date: '2026-07-15',
    time: '10:00 AM',
    notes: 'Follow-up on anxiety crisis',
    status: 'Scheduled',
  },
  {
    id: 'APT-002',
    patientName: 'Carlos Silva',
    date: '2026-07-15',
    time: '11:30 AM',
    notes: 'Standard psychological evaluation',
    status: 'Scheduled',
  },
];

export const Appointments: React.FC = () => {
  const [appointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // Controlled form states
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Error handling state
  const [errorMsg, setErrorMsg] = useState('');

  // Utility to get today's date in YYYY-MM-DD format to block past dates in the HTML input
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Strict business logic validation
  const validateAppointment = (
    selectedDate: string,
    selectedTime: string,
  ): boolean => {
    // 1. Validate weekends (0 = Sunday, 6 = Saturday)
    const appointmentDate = new Date(`${selectedDate}T00:00:00`);
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      setErrorMsg('Clinical appointments cannot be scheduled on weekends.');
      return false;
    }

    // 2. Validate working hours (08:00 to 17:00)
    const [hours, minutes] = selectedTime.split(':').map(Number);
    // Convert to decimal for easier comparison (e.g., 8.5 for 08:30)
    const decimalTime = hours + minutes / 60;
    if (decimalTime < 8.0 || decimalTime > 17.0) {
      setErrorMsg(
        'Appointments must be within university working hours (08:00 - 17:00).',
      );
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();

    // Execute real-world validations before sending to backend
    if (!validateAppointment(date, time)) {
      return;
    }

    // TODO: Connect to NestJS backend POST /api/appointments
    console.log('Validation passed! Payload ready for backend:', {
      patientId,
      date,
      time,
      notes,
    });

    // Reset form after successful submission simulation
    setPatientId('');
    setDate('');
    setTime('');
    setNotes('');
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Left Panel: Appointment Form */}
      <div className="w-1/3 bg-white border-r p-8 overflow-y-auto shadow-sm z-10">
        <div className="mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-teal-600" /> Schedule Appointment
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Book a new clinical session for a student.
          </p>
        </div>

        {/* Validation Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleCreateAppointment} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Patient Name / ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-slate-50"
                placeholder="Search patient ID..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Date
              </label>
              <input
                type="date"
                required
                min={getTodayString()} // Blocks past dates automatically
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setErrorMsg(''); // Clear error when user adjusts time
                }}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Clinical Notes
            </label>
            <textarea
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-slate-50"
              placeholder="Brief reason for the appointment..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2"
          >
            <Plus size={18} /> Book Session
          </button>
        </form>
      </div>

      {/* Right Panel: Upcoming Appointments List */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Upcoming Appointments (Today)
        </h3>
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-teal-300 transition-colors"
            >
              <div className="flex gap-4 items-center">
                <div className="bg-teal-50 p-3 rounded-lg text-teal-600">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {apt.patientName}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Ref: {apt.id} • {apt.notes}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-teal-700 font-bold text-lg">{apt.time}</p>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
