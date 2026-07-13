// Location: apps/care-uce-mobile/src/app/(tabs)/crisis.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { AlertTriangle, Send, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

declare const process: { env?: { EXPO_PUBLIC_API_URL?: string } } | undefined;
const TRIAGE_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3000/api`;

export default function CrisisChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [triageId, setTriageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');

  // Identify session
  useEffect(() => {
    AsyncStorage.getItem('active_triage_id').then((id) => {
      setTriageId(id);
      setLoading(false);
    });
  }, []);

  // Fetch Logic
  const fetchChat = useCallback(async () => {
    if (!triageId) return;
    try {
      const res = await axios.get(`${TRIAGE_API_URL}/triage/${triageId}/chat`);
      setMessages(res.data);
    } catch (e) {
      console.error('Chat sync error', e);
    }
  }, [triageId]);

  // Polling
  useEffect(() => {
    if (!triageId) return;
    fetchChat();
    const interval = setInterval(fetchChat, 2500);
    return () => clearInterval(interval);
  }, [triageId, fetchChat]);

  // Scroll to bottom
  useEffect(() => {
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      300,
    );
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !triageId) return;
    const text = inputText;
    setInputText('');
    try {
      await axios.post(`${TRIAGE_API_URL}/triage/${triageId}/chat`, {
        sender: 'patient',
        text,
      });
      fetchChat();
    } catch {
      setInputText(text); // Restore text on fail
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexArea}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/home')}
            style={styles.backButton}
          >
            <ArrowLeft color="#555" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <AlertTriangle color="#D32F2F" size={20} />
            <Text style={styles.headerTitle}>Línea de Contención</Text>
          </View>
        </View>

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
        >
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#003366"
              style={{ marginTop: 50 }}
            />
          ) : messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.waitingText}>
                No hay conexión activa con el equipo clínico.
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchChat}>
                <RefreshCw color="#FFF" size={20} />
                <Text style={styles.retryText}>Reintentar Conexión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'patient'
                    ? styles.patientBubble
                    : msg.sender === 'system'
                      ? styles.systemBubble
                      : styles.doctorBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'doctor' && styles.doctorText,
                    msg.sender === 'system' && styles.systemText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && { opacity: 0.4 }]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send color="#FFF" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  flexArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: { padding: 8, marginRight: 8 },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingRight: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginLeft: 8,
  },
  chatArea: { flex: 1, padding: 16 },
  chatContent: { paddingBottom: 20 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  waitingText: { color: '#666', marginBottom: 20 },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: '#003366',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryText: { color: '#FFF', marginLeft: 8, fontWeight: 'bold' },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  patientBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#003366',
    borderBottomRightRadius: 4,
  },
  doctorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    alignSelf: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  messageText: { fontSize: 15, color: '#FFF' },
  doctorText: { color: '#333' },
  systemText: { color: '#E65100', fontSize: 12, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    maxHeight: 120,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#003366',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
});
