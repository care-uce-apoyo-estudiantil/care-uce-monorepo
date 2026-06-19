import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Stethoscope,
  HeartHandshake,
  BrainCircuit,
  CalendarDays,
  PlusCircle,
} from 'lucide-react-native';

// Tema Global
import { Colors, Spacing, Typography } from '../../constants/Theme';

// Moléculas
import { DepartmentCard } from '../../components/molecules/DepartmentCard';
import { AppointmentCard } from '../../components/molecules/AppointmentCard';
import { EmptyState } from '../../components/molecules/EmptyState';

// 👇 1. Creamos la interfaz (El molde de los datos)
interface Appointment {
  id: string;
  type: string;
  professional: string;
  date: string;
  time: string;
  status: string;
}

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'new'>('upcoming');

  // 👇 2. Le decimos a TypeScript que este arreglo es de tipo Appointment[]
  const upcomingAppointments: Appointment[] = [];

  const departments = [
    {
      id: '1',
      title: 'Psicología Clínica',
      description: 'Apoyo emocional y terapia individual.',
      icon: Stethoscope,
      color: Colors.primary,
      bg: Colors.primaryLight,
    },
    {
      id: '2',
      title: 'Trabajo Social',
      description: 'Asesoría socioeconómica y vulnerabilidad.',
      icon: HeartHandshake,
      color: Colors.success,
      bg: Colors.successLight,
    },
    {
      id: '3',
      title: 'Psicopedagogía',
      description: 'Orientación en técnicas de estudio.',
      icon: BrainCircuit,
      color: Colors.warning,
      bg: Colors.warningLight,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Selector de Pestañas */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Próximas Citas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.activeTab]}
          onPress={() => setActiveTab('new')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'new' && styles.activeTabText,
            ]}
          >
            Agendar Nueva
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* VISTA 1: PRÓXIMAS CITAS */}
        {activeTab === 'upcoming' && (
          <View>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <AppointmentCard
                  key={appt.id}
                  type={appt.type}
                  professional={appt.professional}
                  date={appt.date}
                  time={appt.time}
                  status={appt.status}
                  onModifyPress={() =>
                    Alert.alert('Modificar', 'Próximamente...')
                  }
                />
              ))
            ) : (
              <EmptyState
                icon={<CalendarDays color={Colors.border} size={64} />}
                title="No tienes citas próximas"
                description="Si necesitas hablar con un profesional, puedes agendar una nueva cita en el sistema."
                actionText="Agendar Cita"
                actionIcon={<PlusCircle color={Colors.primaryText} size={20} />}
                onActionPress={() => setActiveTab('new')}
              />
            )}
          </View>
        )}

        {/* VISTA 2: AGENDAR NUEVA */}
        {activeTab === 'new' && (
          <View>
            <Text style={styles.sectionSubtitle}>
              ¿Con qué departamento necesitas hablar?
            </Text>

            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <DepartmentCard
                  key={dept.id}
                  title={dept.title}
                  description={dept.description}
                  iconBgColor={dept.bg}
                  icon={<Icon color={dept.color} size={28} />}
                  onPress={() =>
                    Alert.alert('Selección', `Has elegido ${dept.title}`)
                  }
                />
              );
            })}

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxText}>
                Toda la información compartida es confidencial y está protegida
                por el secreto profesional de la UCE.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: { borderBottomColor: Colors.primary },
  tabText: {
    ...Typography.subtitle,
    color: Colors.textTertiary,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: { color: Colors.primary },
  scroll: { padding: Spacing.lg },
  sectionSubtitle: { ...Typography.h2, marginBottom: Spacing.md },
  infoBox: {
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.sm,
  },
  infoBoxText: {
    ...Typography.caption,
    color: Colors.primary,
    textAlign: 'center',
  },
});
