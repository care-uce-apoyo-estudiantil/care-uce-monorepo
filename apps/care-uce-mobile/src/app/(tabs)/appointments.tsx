// Location: apps/care-uce-mobile/src/app/(tabs)/appointments.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Clock, UserCheck, ChevronRight } from 'lucide-react-native';

const DOCTORS = [
  {
    id: 1,
    name: 'Dra. Ana López',
    role: 'Psicóloga Clínica',
    available: 'Hoy, 14:00',
    bgColor: '#E8F0FE',
    iconColor: '#1976D2',
  },
  {
    id: 2,
    name: 'Dr. Carlos Mendoza',
    role: 'Terapeuta Cognitivo',
    available: 'Mañana, 09:00',
    bgColor: '#FCE4EC',
    iconColor: '#C2185B',
  },
  {
    id: 3,
    name: 'Dra. María Paz',
    role: 'Orientadora Vocacional',
    available: 'Viernes, 11:30',
    bgColor: '#E8F5E9',
    iconColor: '#388E3C',
  },
];

export default function AppointmentsScreen() {
  const handleBook = (doctorName: string) => {
    Alert.alert(
      'Agendar Sesión',
      `¿Deseas solicitar una cita con ${doctorName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () =>
            Alert.alert(
              '¡Éxito!',
              'Tu solicitud ha sido enviada al departamento de bienestar estudiantil.',
            ),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Agendar Cita</Text>
          <Text style={styles.subtitle}>
            Selecciona un especialista disponible en el departamento de
            Bienestar Universitario.
          </Text>
        </View>

        <View style={styles.listContainer}>
          {DOCTORS.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => handleBook(doc.name)}
            >
              <View style={styles.cardContent}>
                <View style={[styles.avatar, { backgroundColor: doc.bgColor }]}>
                  <UserCheck color={doc.iconColor} size={24} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.docName}>{doc.name}</Text>
                  <Text style={styles.docRole}>{doc.role}</Text>
                  <View style={styles.availability}>
                    <Clock color="#666" size={14} />
                    <Text style={styles.timeText}>Libre: {doc.available}</Text>
                  </View>
                </View>
                <ChevronRight color="#CCC" size={24} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20, paddingTop: 30 },
  header: { marginBottom: 24 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  subtitle: { fontSize: 15, color: '#666', lineHeight: 22 },
  listContainer: { gap: 16 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  docName: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  docRole: { fontSize: 14, color: '#666', marginBottom: 8 },
  availability: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeText: { fontSize: 13, color: '#666', fontWeight: '500' },
});
