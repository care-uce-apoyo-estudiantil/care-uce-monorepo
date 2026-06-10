import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Menu, MessageCircle, Phone } from 'lucide-react-native';
import { EmergencyButton } from '../components/atoms/EmergencyButton';
import { SupportCard } from '../components/molecules/SupportCard';
import { Sidebar } from '../components/organisms/Sidebar';

export function HomeScreen() {
  // Estado para controlar la visibilidad del Sidebar
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const handleEmergency = () => {
    console.log('¡Emergencia activada!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Superior */}
      <View style={styles.header}>
        {/* Al presionar el menú, cambiamos el estado a true */}
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => setSidebarVisible(true)}
        >
          <Menu color="#FFFFFF" size={28} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerSubtitle}>CAreUCE</Text>
          <Text style={styles.headerTitle}>Inicio</Text>
        </View>
        <View style={styles.headerAvatar} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.textSection}>
          <Text style={styles.mainHeading}>¿Necesitas ayuda?</Text>
          <Text style={styles.subHeading}>
            Estamos aquí para apoyarte en todo momento.
          </Text>
        </View>

        <View style={styles.emergencySection}>
          <EmergencyButton onPress={handleEmergency} />
          <Text style={styles.emergencyHelper}>Presiona en caso de crisis</Text>
        </View>

        <View style={styles.cardsSection}>
          <SupportCard
            title="Chat de Apoyo"
            subtitle="Habla con un consejero ahora"
            Icon={MessageCircle}
            iconColor="#28A745"
            iconBgColor="#E8F5E9"
            badgeText="EN LÍNEA"
            onPress={() => console.log('Abrir Chat')}
          />
          <SupportCard
            title="Línea de Ayuda 24/7"
            subtitle="1800-CARE-UCE"
            Icon={Phone}
            iconColor="#003366"
            iconBgColor="#E6EEF5"
            actionButton={{
              text: 'Llamar',
              onPress: () => console.log('Llamando...'),
            }}
          />
        </View>
      </ScrollView>

      {/* Aquí inyectamos el Organismo Sidebar */}
      <Sidebar
        visible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  menuIcon: {
    marginRight: 16,
  },
  headerSubtitle: {
    color: '#A0BADD',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#99B3CC',
    marginLeft: 'auto',
  },
  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    color: '#666666',
  },
  emergencySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emergencyHelper: {
    marginTop: 16,
    color: '#CC3333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardsSection: {
    width: '100%',
  },
});
