// Location: apps/care-uce-mobile/src/components/atoms/EmergencyButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

interface EmergencyButtonProps {
  /**
   * Function to execute when the panic button is pressed.
   * Handled by the parent component to trigger the emergency modal.
   */
  onPress: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.buttonContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.innerContent}>
        <View style={styles.iconWrapper}>
          <AlertTriangle color="#FFF" size={36} />
        </View>
        <View>
          <Text style={styles.mainText}>BOTÓN DE PÁNICO</Text>
          <Text style={styles.subText}>
            Toque aquí en caso de crisis emocional
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#D32F2F', // Deep red for clinical emergencies
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  mainText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subText: {
    color: '#FFEBEE',
    fontSize: 13,
    fontWeight: '500',
  },
});
