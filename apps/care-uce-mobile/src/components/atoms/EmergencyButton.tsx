// Location: apps/care-uce-mobile/src/components/atoms/EmergencyButton.tsx
import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import triageService from '../../services/triageService';

interface EmergencyButtonProps {
  onPress?: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onPress,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergencyTrigger = async () => {
    if (onPress) onPress();

    setIsLoading(true);
    try {
      // 1. Envía la alerta real al backend
      await triageService.triggerEmergency('High stress panic attack detected');

      // 2. Muestra éxito
      Alert.alert(
        'Emergency Alert Sent',
        'A clinical psychologist has been notified and will contact you immediately. Please stay safe.',
      );
    } catch {
      Alert.alert(
        'Connection Error',
        "We couldn't reach the server. Please call emergency services directly.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={handleEmergencyTrigger}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.rippleEffect}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <Ionicons name="warning" size={48} color="#FFFFFF" />
        )}
      </View>
      <Text style={styles.buttonText}>
        {isLoading ? 'SENDING ALERT...' : 'PANIC BUTTON'}
      </Text>
    </TouchableOpacity>
  );
};

// 🔥 AQUÍ ESTABA EL ERROR: Faltaba definir los estilos
const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  rippleEffect: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EF4444', // Red-500
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    marginTop: 15,
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});
