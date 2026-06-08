import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export const SocialAuth = () => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.ssoButton}>
      <Text style={styles.text}>Google</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.ssoButton}>
      <Text style={styles.text}>Office 365</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  ssoButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF'
  },
  text: { color: '#333', fontFamily: 'Inter', fontSize: 14, fontWeight: '600' }
});