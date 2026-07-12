// Location: apps/care-uce-mobile/src/app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Calendar, BookHeart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

// Importamos nuestros nuevos componentes del Atomic Design
import { EmergencyButton } from '../../components/atoms/EmergencyButton';
import { ActionCard } from '../../components/molecules/ActionCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // 🔥 Smart display name resolver to always show a friendly name
  const getDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.fullName) return user.fullName;
    // Fallback: If no name exists, split the email before the '@' sign
    if (user?.email) return user.email.split('@')[0];
    return 'Estudiante';
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{getDisplayName()} 👋</Text>
          <Text style={styles.subtitle}>
            ¿Cómo podemos ayudarte hoy con tu bienestar?
          </Text>
        </View>

        {/* Atom: Emergency Panic Button */}
        <EmergencyButton onPress={() => router.push('/(tabs)/crisis')} />

        {/* Services Section */}
        <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
        <View style={styles.grid}>
          {/* Molecules: Action Cards */}
          <ActionCard
            title="Agendar Cita"
            description="Atención Profesional"
            icon={<Calendar color="#003366" size={26} />}
            iconBgColor="#E8F0FE"
            onPress={() => router.push('/(tabs)/appointments')}
          />

          <ActionCard
            title="Guías de Apoyo"
            description="Artículos y Tips"
            icon={<BookHeart color="#C2185B" size={26} />}
            iconBgColor="#FCE4EC"
            onPress={() => Alert.alert('Recursos', 'Próximamente...')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  container: { padding: 20, paddingTop: 30 },
  welcomeSection: { marginBottom: 24 },
  greeting: { fontSize: 16, color: '#666666' },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 2,
    textTransform: 'capitalize', // Convierte "colombia" en "Colombia"
  },
  subtitle: { fontSize: 14, color: '#666666', marginTop: 6 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 14,
  },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
});
