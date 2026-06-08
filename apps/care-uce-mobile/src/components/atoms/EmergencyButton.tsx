import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';

interface EmergencyButtonProps {
  onPress: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.outerRing}>
      <View style={styles.middleRing}>
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
          <ShieldAlert color="#FFFFFF" size={48} strokeWidth={1.5} style={styles.icon} />
          <Text style={styles.text}>EMERGENCIA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    backgroundColor: 'rgba(204, 51, 51, 0.1)',
    borderRadius: 150,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleRing: {
    backgroundColor: 'rgba(204, 51, 51, 0.2)',
    borderRadius: 150,
    padding: 20,
  },
  button: {
    backgroundColor: '#CC3333',
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#CC3333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
  },
});