import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ShieldAlert, ShieldCheck, MessageSquare } from 'lucide-react-native';

export default function CrisisScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ShieldAlert color="#D32F2F" size={80} style={{ marginBottom: 20 }} />
        <Text style={styles.title}>Línea de Respuesta Inmediata</Text>
        <Text style={styles.description}>
          Si te encuentras en una situación de emergencia o riesgo extremo,
          presiona el botón para alertar al equipo de bienestar estudiantil.
        </Text>
        <TouchableOpacity
          style={styles.panicButton}
          onPress={() =>
            Alert.alert(
              'Alerta de Emergencia',
              'Conectando con el brigadista de turno de la UCE...',
            )
          }
        >
          <Text style={styles.panicText}>ACTIVAR AUXILIO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() =>
            Alert.alert('Chat en Vivo', 'Iniciando chat seguro 24/7...')
          }
        >
          <MessageSquare color="#003366" size={20} />
          <Text style={styles.chatText}> Iniciar Chat de Soporte</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  panicButton: {
    backgroundColor: '#D32F2F',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  panicText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  chatButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#003366',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: { color: '#003366', fontSize: 16, fontWeight: 'bold' },
});
