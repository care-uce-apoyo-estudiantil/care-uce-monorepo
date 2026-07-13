// Location: apps/care-uce-mobile/src/app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import {
  LogOut,
  Settings,
  ShieldCheck,
  X,
  KeyRound,
  Calendar as CalendarIcon,
  ChevronDown,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// Injected system parameters setup
declare const process: { env: { EXPO_PUBLIC_API_URL?: string } } | undefined;
const AUTH_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3000/api`;

// Engineering faculty allowed majors exclusively
const ALLOWED_MAJORS = [
  'Sistemas de Información',
  'Ingeniería Civil',
  'Ingeniería Mecánica',
  'Ingeniería en Diseño Industrial',
  'Ingeniería en Computación',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Local reactive form states
  const [modalVisible, setModalVisible] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [major, setMajor] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // DatePicker & MajorPicker interactive elements states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState(new Date(2002, 0, 1));
  const [showMajorPicker, setShowMajorPicker] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.birthDate) {
            setBirthDate(parsed.birthDate);
            setDateObj(new Date(parsed.birthDate));
          }
          if (parsed.major) setMajor(parsed.major);
        }
      } catch (error) {
        console.error('Error reading profile cache:', error);
      }
    };
    loadSavedData();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  // Safe handler for Native Datepicker events
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setBirthDate(formattedDate);
    }
  };

  const handleSaveProfile = async () => {
    if (!birthDate || !major) {
      Alert.alert(
        'Campos Incompletos',
        'Por favor selecciona tu fecha de nacimiento y carrera.',
      );
      return;
    }

    setIsSaving(true);
    try {
      // 1. Transactional patch to update student demographics
      await axios.patch(`${AUTH_API_URL}/auth/profile/student`, {
        email: user?.email,
        birthDate: birthDate,
        major: major,
      });

      // 2. Persistent storage sync strictly under 'user' key
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.birthDate = birthDate;
        parsed.major = major;
        await AsyncStorage.setItem('user', JSON.stringify(parsed));
      }

      // 3. Security patch if password was provided
      if (newPassword.trim().length > 0) {
        if (newPassword.length < 6) {
          Alert.alert(
            'Seguridad',
            'La nueva contraseña debe tener al menos 6 caracteres.',
          );
          setIsSaving(false);
          return;
        }
        await axios.patch(`${AUTH_API_URL}/auth/users/password`, {
          email: user?.email,
          password: newPassword,
        });

        setIsSaving(false);
        setNewPassword('');
        setModalVisible(false);

        // Security requirement: evict after password reset
        Alert.alert(
          'Seguridad CareUCE',
          'Contraseña actualizada con éxito. Por seguridad, debes reautenticarte.',
          [
            {
              text: 'Entendido',
              onPress: async () => {
                await logout();
                router.replace('/');
              },
            },
          ],
        );
        return;
      }

      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      setModalVisible(false);
    } catch (error) {
      console.error('Profile synchronization failure:', error);
      Alert.alert('Error', 'Problema al sincronizar con el backend.');
    } finally {
      setIsSaving(false);
    }
  };

  const getDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.fullName) return user.fullName;
    return 'Estudiante';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {getDisplayName().charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {getDisplayName()}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email || 'estudiante@uce.edu.ec'}
        </Text>
        <Text style={styles.role}>Estudiante UCE</Text>

        {(!birthDate || !major) && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>⚠️ Perfil Clínico Incompleto</Text>
          </View>
        )}
      </View>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setModalVisible(true)}
        >
          <Settings color="#555" size={20} />
          <Text style={styles.menuText}>Configuración de la Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <ShieldCheck color="#555" size={20} />
          <Text style={styles.menuText}>Privacidad y Seguridad</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
          onPress={handleLogout}
        >
          <LogOut color="#D32F2F" size={20} />
          <Text
            style={[styles.menuText, { color: '#D32F2F', fontWeight: 'bold' }]}
          >
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>

      {/* Master Configuration Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurar Cuenta</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#555" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Fecha de Nacimiento</Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowDatePicker(true)}
                >
                  <CalendarIcon color="#003366" size={20} />
                  <Text style={styles.pickerText}>
                    {birthDate || 'Seleccionar fecha...'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dateObj}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    maximumDate={new Date(2010, 11, 31)}
                  />
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Facultad de Ingeniería (Carrera)
                </Text>
                <TouchableOpacity
                  style={styles.pickerTrigger}
                  onPress={() => setShowMajorPicker(true)}
                >
                  <Text style={styles.pickerText}>
                    {major || 'Seleccionar carrera...'}
                  </Text>
                  <ChevronDown color="#555" size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Actualizar Contraseña (Opcional)
                </Text>
                <View style={styles.passwordInputContainer}>
                  <KeyRound color="#888" size={18} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { flex: 1, paddingLeft: 40 }]}
                    placeholder="Nueva contraseña de seguridad"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    Guardar y Sincronizar
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sub-Modal specifically for isolating Engineering Majors selection */}
      <Modal visible={showMajorPicker} animationType="fade" transparent={true}>
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownContent}>
            <Text style={styles.dropdownTitle}>Selecciona tu Carrera</Text>
            {ALLOWED_MAJORS.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setMajor(item);
                  setShowMajorPicker(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.dropdownCancel}
              onPress={() => setShowMajorPicker(false)}
            >
              <Text style={styles.dropdownCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    paddingTop: 30,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#003366' },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  email: { fontSize: 14, color: '#003366', paddingHorizontal: 10 },
  role: { fontSize: 14, color: '#666', marginTop: 8, fontWeight: '500' },
  warningBadge: {
    marginTop: 12,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  warningText: { color: '#E65100', fontSize: 12, fontWeight: 'bold' },
  menu: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuText: { marginLeft: 12, fontSize: 15, color: '#333' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 480,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#003366' },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F8F9FA',
  },
  pickerText: { fontSize: 16, color: '#333', flex: 1, marginLeft: 10 },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: { position: 'absolute', left: 14, zIndex: 1 },
  saveButton: {
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: { fontSize: 16, color: '#333', textAlign: 'center' },
  dropdownCancel: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  dropdownCancelText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
