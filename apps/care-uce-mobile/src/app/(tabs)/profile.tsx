// Location: apps/care-uce-mobile/src/app/(tabs)/profile.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LogOut, Settings, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth(); // Consumimos el estado y método global

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout(); // Destruye el token del AsyncStorage
            router.replace('/'); // Redirección limpia al Login
          } catch (error) {
            console.error('Error al cerrar sesión desde perfil:', error);
          }
        },
      },
    ]);
  };

  // 🔥 Smart display name resolver to always show a friendly name
  const getDisplayName = () => {
    if (user?.nombre) return user.nombre;
    if (user?.name) return user.name;
    if (user?.fullName) return user.fullName;
    // Fallback: If no name exists, use 'Estudiante' in the profile avatar
    return 'Estudiante';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tarjeta de Información de Usuario */}
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
      </View>

      {/* Menú de Configuraciones */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Settings color="#555" size={20} />
          <Text style={styles.menuText}>Configuración de la Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <ShieldCheck color="#555" size={20} />
          <Text style={styles.menuText}>Privacidad y Seguridad</Text>
        </TouchableOpacity>

        {/* Opción de Cierre de Sesión Enlazada */}
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
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 14,
    color: '#003366',
    paddingHorizontal: 10,
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
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
  menuText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
});
