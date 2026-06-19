import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { PhoneCall } from 'lucide-react-native';
// Importamos nuestro Theme
import { Colors, Spacing, Typography } from '../../constants/Theme';

interface EmergencyButtonProps {
  onPress: () => void;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
}

export const EmergencyButton = ({
  onPress,
  title = 'AYUDA RÁPIDA',
  subtitle = 'Soporte 24h',
  style,
}: EmergencyButtonProps) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.panicButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <PhoneCall color={Colors.crisisText} size={36} />
      </TouchableOpacity>

      {/* Texto debajo del botón circular */}
      <Text style={styles.panicTitle}>{title}</Text>
      {subtitle && <Text style={styles.panicSub}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  panicButton: {
    backgroundColor: Colors.crisis, // Usamos el color del tema
    width: 100, // Lo hacemos circular
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm, // Espacio para el texto de abajo

    // Sombras intensas para destacar
    shadowColor: Colors.crisis,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10, // Sombra para Android
  },
  panicTitle: {
    // Usamos la tipografía del tema
    ...Typography.emergencyTitle,
    color: Colors.crisis, // Cambiamos el color para que se lea fuera del botón
    textAlign: 'center',
  },
  panicSub: {
    ...Typography.emergencySub,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
