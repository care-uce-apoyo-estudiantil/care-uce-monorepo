// Location: apps/care-uce-mobile/src/app/(tabs)/appointments.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  UserCheck,
  ChevronRight,
  ArrowLeft,
  BriefcaseMedical,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import authService from '../../services/authService';
import appointmentService, {
  Doctor,
  AppointmentPayload,
} from '../../services/appointmentService';

const getNext5WorkDays = (): Date[] => {
  const dates: Date[] = [];
  const current = new Date();

  while (dates.length < 5) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const AREAS = [
  { id: 'psicologia', name: 'Psicología Clínica' },
  { id: 'orientacion', name: 'Orientación Vocacional' },
  { id: 'trabajo_social', name: 'Trabajo Social' },
];

const TIME_SLOTS = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookedSlots, setBookedSlots] = useState<Date[]>([]);

  const validDates = getNext5WorkDays();

  // 🔥 NUEVO: Filtra en vivo llamando al backend con el área seleccionada
  const fetchDoctorsForArea = async (areaName: string) => {
    setSelectedArea(areaName);
    setStep(2);
    setIsLoading(true);
    setDoctors([]); // Limpiar doctores anteriores
    try {
      const filteredDoctors =
        await appointmentService.getAvailableDoctors(areaName);
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los especialistas para esta área.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDoctor = async (doc: Doctor) => {
    setSelectedDoctor(doc);
    setStep(3);
    setSelectedDate(validDates[0]);
    setIsLoading(true);

    try {
      const apts = await appointmentService.getDoctorAppointments(doc.nombre);
      setBookedSlots(
        apts.map((a: AppointmentPayload) => new Date(a.scheduledAt)),
      );
    } catch (error) {
      console.error('Error loading doctor agenda:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSlotDate = (timeStr: string, baseDate: Date): Date => {
    const [time, modifier] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hr = parseInt(hours, 10);

    if (hr === 12 && modifier === 'AM') hr = 0;
    if (hr !== 12 && modifier === 'PM') hr += 12;

    const date = new Date(baseDate);
    date.setHours(hr, parseInt(minutes, 10), 0, 0);
    return date;
  };

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    setIsBooking(true);

    try {
      const user = await authService.getStoredUser();
      const scheduledAt = getSlotDate(selectedTime, selectedDate);

      const payload: AppointmentPayload = {
        studentName: user?.nombre || user?.email || 'Estudiante UCE',
        studentEmail: user?.email || 'sin-correo@uce.edu.ec',
        doctorName: selectedDoctor.nombre,
        scheduledAt: scheduledAt.toISOString(),
      };

      await appointmentService.bookAppointment(payload);

      Alert.alert(
        '¡Cita Confirmada!',
        `Tu sesión ha sido agendada con éxito.\n\nEspecialista: ${selectedDoctor.nombre}\nFecha: ${scheduledAt.toLocaleDateString()} a las ${selectedTime}`,
        [{ text: 'Entendido', onPress: () => router.replace('/(tabs)/home') }],
      );
    } catch {
      Alert.alert('Error', 'Ocurrió un problema al agendar.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {step > 1 && (
          <TouchableOpacity
            onPress={() => setStep(step - 1)}
            style={styles.backBtn}
          >
            <ArrowLeft color="#003366" size={24} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={styles.title}>Agendar Cita</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Step 1: Select Area'
              : step === 2
                ? 'Step 2: Choose Specialist'
                : `Step 3: ${selectedArea}`}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* PASO 1: ÁREA CLÍNICA */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            {AREAS.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={styles.card}
                onPress={() => fetchDoctorsForArea(area.name)} // 🔥 Ejecuta el filtro estricto
              >
                <View style={[styles.avatar, { backgroundColor: '#E8F0FE' }]}>
                  <BriefcaseMedical color="#1976D2" size={24} />
                </View>
                <Text style={styles.cardText}>{area.name}</Text>
                <ChevronRight color="#CCC" size={24} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* PASO 2: DOCTORES */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#003366" />
            ) : doctors.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text
                  style={{ color: '#666', fontSize: 16, textAlign: 'center' }}
                >
                  No hay especialistas registrados en el área de {selectedArea}{' '}
                  por el momento.
                </Text>
              </View>
            ) : (
              doctors.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.card}
                  onPress={() => handleSelectDoctor(doc)}
                >
                  <View style={[styles.avatar, { backgroundColor: '#FCE4EC' }]}>
                    <UserCheck color="#C2185B" size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardText} numberOfLines={1}>
                      {doc.nombre}
                    </Text>
                    <Text style={{ color: '#666', fontSize: 13 }}>
                      {selectedArea}
                    </Text>
                  </View>
                  <ChevronRight color="#CCC" size={24} />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* PASO 3: FECHAS Y HORAS */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>1. Available Days</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {validDates.map((date, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dateChip,
                    selectedDate?.getTime() === date.getTime() &&
                      styles.dateChipActive,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate?.getTime() === date.getTime() && {
                        color: '#FFF',
                      },
                    ]}
                  >
                    {date.toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedDate && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  2. Free Time Slots
                </Text>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#003366" />
                ) : (
                  <View style={styles.grid}>
                    {TIME_SLOTS.map((time, idx) => {
                      const slotDate = getSlotDate(time, selectedDate);
                      const isOccupied = bookedSlots.some(
                        (b) => b.getTime() === slotDate.getTime(),
                      );

                      return (
                        <TouchableOpacity
                          key={idx}
                          disabled={isOccupied}
                          style={[
                            styles.timeChip,
                            selectedTime === time && styles.timeChipActive,
                            isOccupied && styles.timeChipOccupied,
                          ]}
                          onPress={() => setSelectedTime(time)}
                        >
                          <Text
                            style={[
                              styles.timeText,
                              selectedTime === time && { color: '#FFF' },
                              isOccupied && { color: '#AAA' },
                            ]}
                          >
                            {isOccupied ? 'Ocupado' : time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.btnPrimary,
                    (isBooking || !selectedTime) && { opacity: 0.7 },
                  ]}
                  onPress={handleBook}
                  disabled={!selectedTime || isBooking}
                >
                  {isBooking ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.btnText}>Confirm Booking</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  backBtn: { marginRight: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  container: { padding: 20 },
  stepContainer: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  horizontalScroll: { flexDirection: 'row', marginBottom: 10 },
  dateChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    marginRight: 10,
  },
  dateChipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    textTransform: 'capitalize',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeChip: {
    width: '48%',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: '#003366', borderColor: '#003366' },
  timeChipOccupied: { backgroundColor: '#F0F0F0', borderColor: '#E0E0E0' },
  timeText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
  btnPrimary: {
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
