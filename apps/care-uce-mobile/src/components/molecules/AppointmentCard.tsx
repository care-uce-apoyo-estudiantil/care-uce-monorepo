import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarDays, Clock, User } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../constants/Theme';

interface AppointmentCardProps {
  type: string;
  professional: string;
  date: string;
  time: string;
  status: string;
  onModifyPress: () => void;
}

export const AppointmentCard = ({
  type,
  professional,
  date,
  time,
  status,
  onModifyPress,
}: AppointmentCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={Typography.cardTitle}>{type}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.infoRow}>
          <User color={Colors.textSecondary} size={18} />
          <Text style={styles.infoText}>{professional}</Text>
        </View>
        <View style={styles.infoRow}>
          <CalendarDays color={Colors.textSecondary} size={18} />
          <Text style={styles.infoText}>{date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock color={Colors.textSecondary} size={18} />
          <Text style={styles.infoText}>{time}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onModifyPress}>
        <Text style={styles.actionButtonText}>Modificar Cita</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statusBadge: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { color: Colors.success, fontSize: 12, fontWeight: 'bold' },
  body: { marginBottom: Spacing.lg },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  infoText: { ...Typography.body, marginLeft: 10 },
  actionButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
