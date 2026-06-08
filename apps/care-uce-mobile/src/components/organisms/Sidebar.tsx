import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Home, Calendar, FileText, Bell, Settings, LogOut, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    onClose(); // Cierra el modal primero
    router.replace('/'); // Te redirige al login
  };

  const MenuItem = ({ icon: Icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon color="#333333" size={24} style={styles.menuIcon} />
      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        {/* Contenedor principal del Sidebar (El panel blanco/azul) */}
        <View style={styles.sidebarContainer}>
          
          {/* Header Azul */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
            
            <View style={styles.profileSection}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>MJ</Text> 
              </View>
              <View>
                <Text style={styles.userName}>María José</Text>
                <Text style={styles.userEmail}>mj.doe@uce.edu.ec</Text>
              </View>
            </View>
          </View>

          {/* Menú de Opciones */}
          <View style={styles.menuContainer}>
            <MenuItem icon={Home} label="Inicio / Crisis" onPress={onClose} />
            <MenuItem icon={Calendar} label="Mis Citas" onPress={() => {}} />
            <MenuItem icon={FileText} label="Historial Médico" onPress={() => {}} />
            <MenuItem icon={Bell} label="Notificaciones" onPress={() => {}} />
            <MenuItem icon={Settings} label="Configuración" onPress={() => {}} />
          </View>

          {/* Botón de Cerrar Sesión */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut color="#CC3333" size={20} style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Área oscura a la derecha: Al tocarla se cierra el menú */}
        <TouchableOpacity style={styles.outsideClick} onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Fondo oscuro semitransparente
  },
  sidebarContainer: {
    width: '80%', // Ocupa el 80% de la pantalla
    backgroundColor: '#FFFFFF',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  outsideClick: {
    flex: 1, // Ocupa el 20% restante para poder hacer clic y cerrar
  },
  header: {
    backgroundColor: '#003366',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 6,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#99B3CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    color: '#003366',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#B3C6D9',
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    color: '#CC3333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});