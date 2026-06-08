import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ShieldAlert, Calendar, FolderHeart, Settings } from 'lucide-react-native';

// Importing Molecules
import { ActionCard } from '../components/molecules/ActionCard';

/**
 * HomeScreen Component
 * The main dashboard displayed after successful authentication.
 * Uses Atomic components to render service modules.
 */
export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, Davinson 👋</Text>
            <Text style={styles.subtitle}>¿En qué podemos ayudarte hoy?</Text>
          </View>
        </View>

        {/* Emergency Banner (Organism Level) */}
        <View style={styles.emergencyBanner}>
          <ShieldAlert color="#FFFFFF" size={28} />
          <View style={styles.emergencyTextContainer}>
            <Text style={styles.emergencyTitle}>¿Necesitas ayuda inmediata?</Text>
            <Text style={styles.emergencySubtitle}>Toca aquí para ir al Chat de Crisis</Text>
          </View>
        </View>

        {/* Services Grid (Organism Level) */}
        <Text style={styles.sectionTitle}>Servicios Estudiantiles</Text>
        
        <View style={styles.gridContainer}>
          <ActionCard 
            title="Agendar Cita" 
            Icon={Calendar} 
            isUnderConstruction={true}
            onPress={() => console.log('Appointment module tapped')} 
          />
          <ActionCard 
            title="Mis Casos" 
            Icon={FolderHeart} 
            isUnderConstruction={true}
            onPress={() => console.log('Cases module tapped')} 
          />
          <ActionCard 
            title="Chat de Emergencia" 
            Icon={ShieldAlert} 
            isUnderConstruction={false} // This one could be active!
            onPress={() => console.log('Chat module tapped')} 
          />
          <ActionCard 
            title="Configuración" 
            Icon={Settings} 
            isUnderConstruction={true}
            onPress={() => console.log('Settings module tapped')} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  greeting: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#003366' },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#666666', marginTop: 4 },
  emergencyBanner: {
    backgroundColor: '#CC3333', // CareUCE Emergency Red
    borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 30,
    shadowColor: '#CC3333', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  emergencyTextContainer: { marginLeft: 16, flex: 1 },
  emergencyTitle: { color: '#FFFFFF', fontFamily: 'Inter-Bold', fontSize: 16 },
  emergencySubtitle: { color: '#FFFFFF', fontFamily: 'Inter-Regular', fontSize: 13, marginTop: 2, opacity: 0.9 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#333333', marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});