// Location: apps/care-uce-mobile/src/app/(tabs)/home.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Calendar, BookHeart, AlertTriangle, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';

import { EmergencyButton } from '../../components/atoms/EmergencyButton';
import { ActionCard } from '../../components/molecules/ActionCard';

declare const process: { env?: { EXPO_PUBLIC_API_URL?: string } } | undefined;
const TRIAGE_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3000/api`;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [isPanicModalVisible, setPanicModalVisible] = useState(false);
  const [panicReason, setPanicReason] = useState('');
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  const getDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.fullName) return user.fullName;
    if (user?.email) return user.email.split('@')[0];
    return 'Estudiante';
  };

  const calculateAge = (birthDateString?: string): number => {
    if (!birthDateString) return 0;
    try {
      const birthDate = new Date(birthDateString);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age > 0 ? age : 0;
    } catch {
      return 0;
    }
  };

  const executePanicAlert = async () => {
    if (!panicReason.trim()) {
      Alert.alert(
        'Información requerida',
        'Por favor, describe brevemente tu situación para que el profesional pueda ayudarte mejor.',
      );
      return;
    }

    setIsSendingAlert(true);
    try {
      const freshUser = await authService.getStoredUser();

      const finalBirthDate = freshUser?.birthDate || user?.birthDate;
      const finalMajor = freshUser?.major || user?.major;
      const exactAge = calculateAge(finalBirthDate);

      const fallbackName =
        freshUser?.nombre || getDisplayName() !== 'Estudiante'
          ? getDisplayName()
          : 'Estudiante No Registrado';

      const payload = {
        patientName: fallbackName,
        patientAge: exactAge > 0 ? exactAge : 20,
        academicMajor: finalMajor || 'Carrera no especificada',
        crisisReason: panicReason,
        priorityLevel: 'Alta',
      };

      const response = await axios.post(`${TRIAGE_API_URL}/triage`, payload);

      // 🔥 CRITICAL FIX: Save the triage ID to memory so the chat can use it immediately
      await AsyncStorage.setItem('active_triage_id', response.data.id);

      setPanicModalVisible(false);
      setPanicReason('');
      router.push('/(tabs)/crisis');
    } catch (error) {
      console.error('Failed to broadcast panic alert:', error);
      Alert.alert(
        'Error de Red',
        'No se pudo contactar al servicio central. Entrando al protocolo offline.',
      );
      setPanicModalVisible(false);
      router.push('/(tabs)/crisis');
    } finally {
      setIsSendingAlert(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hola,</Text>
          <Text style={styles.userName}>{getDisplayName()} 👋</Text>
          <Text style={styles.subtitle}>
            ¿Cómo podemos ayudarte hoy con tu bienestar?
          </Text>
        </View>

        <EmergencyButton onPress={() => setPanicModalVisible(true)} />

        <Text style={styles.sectionTitle}>Servicios Disponibles</Text>
        <View style={styles.grid}>
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

      <Modal
        visible={isPanicModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AlertTriangle
                  color="#D32F2F"
                  size={24}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>Alerta de Emergencia</Text>
              </View>
              <TouchableOpacity onPress={() => setPanicModalVisible(false)}>
                <X color="#555" size={24} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDescription}>
              Describe brevemente tu situación o motivo de la crisis para que el
              profesional de turno pueda atenderte con prioridad.
            </Text>
            <TextInput
              style={styles.panicInput}
              multiline
              numberOfLines={4}
              placeholder="Ej. Siento mucha ansiedad, taquicardia..."
              value={panicReason}
              onChangeText={setPanicReason}
              autoFocus
            />
            <TouchableOpacity
              style={[
                styles.panicSubmitButton,
                isSendingAlert && { opacity: 0.7 },
              ]}
              onPress={executePanicAlert}
              disabled={isSendingAlert}
            >
              {isSendingAlert ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.panicSubmitText}>
                  Enviar Alerta a Clínica
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    textTransform: 'capitalize',
  },
  subtitle: { fontSize: 14, color: '#666666', marginTop: 6 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 14,
  },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#D32F2F' },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  panicInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  panicSubmitButton: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  panicSubmitText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
