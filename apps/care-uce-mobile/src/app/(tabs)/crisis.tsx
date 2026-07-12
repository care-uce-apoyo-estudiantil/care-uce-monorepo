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
import {
  AlertTriangle,
  Send,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Strict interface for chat payloads
interface ChatMessage {
  id: string;
  text: string;
  sender: 'patient' | 'doctor' | 'system';
  timestamp: string;
}

declare const process: { env?: { EXPO_PUBLIC_API_URL?: string } } | undefined;
const TRIAGE_API_URL = `${process?.env?.EXPO_PUBLIC_API_URL ?? 'http://localhost'}:3001/api`;

export default function CrisisChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const [triageId, setTriageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // 1. Identify active session ID securely
  useEffect(() => {
    const fetchSessionId = async () => {
      try {
        const id = await AsyncStorage.getItem('active_triage_id');
        if (id) {
          setTriageId(id);
        }
      } catch (error) {
        console.error('Error retrieving session ID:', error);
      }
    };
    fetchSessionId();
  }, []);

  // 2. Continuous Polling mechanism to sync with backend
  const fetchChat = useCallback(async () => {
    if (!triageId) return;
    try {
      const res = await axios.get<ChatMessage[]>(
        `${TRIAGE_API_URL}/triage/${triageId}/chat`,
      );
      setMessages(res.data);
    } catch (error) {
      // Silent catch to prevent UI interruption during polling failures
      console.warn('Silent polling failure:', error);
    }
  }, [triageId]);

  // Execute polling loop
  useEffect(() => {
    if (!triageId) return;

    // Initial fetch immediately
    fetchChat();

    // Set up polling interval every 2.5 seconds for snappier feel
    const interval = setInterval(fetchChat, 2500);
    return () => clearInterval(interval);
  }, [triageId, fetchChat]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 3. Robust message dispatch handler
  const handleSend = async () => {
    if (!inputText.trim() || !triageId || isSending) return;

    const textToSend = inputText.trim();
    setInputText(''); // Optimistic clear
    setIsSending(true);

    try {
      await axios.post(`${TRIAGE_API_URL}/triage/${triageId}/chat`, {
        sender: 'patient',
        text: textToSend,
      });
      // Immediately pull fresh data after successful post
      await fetchChat();
    } catch (error) {
      console.error('Message dispatch error:', error);
      // Restore text if failed
      setInputText(textToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleExit = async () => {
    // Optionally clear active triage id if you want them to lose access after leaving
    // await AsyncStorage.removeItem('active_triage_id');
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flexArea}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust offset for standard tab navigation
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit} style={styles.backButton}>
            <ArrowLeft color="#555" size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <AlertTriangle color="#D32F2F" size={20} />
            <Text style={styles.headerTitle}>Línea de Contención</Text>
          </View>
        </View>

        <View style={styles.securityBanner}>
          <ShieldCheck color="#2E7D32" size={16} />
          <Text style={styles.securityText}>
            Canal cifrado con el equipo clínico. Total confidencialidad.
          </Text>
        </View>

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
        >
          {messages.length === 0 ? (
            <View style={styles.waitingContainer}>
              <ActivityIndicator size="large" color="#003366" />
              <Text style={styles.waitingText}>
                Conectando con el canal seguro...
              </Text>
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
                {msg.sender === 'system' && (
                  <Text style={styles.systemTextHeader}>SISTEMA CareUCE</Text>
                )}
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
            placeholderTextColor="#888"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isSending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && { opacity: 0.4 },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Send color="#FFF" size={20} />
            )}
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
  securityBanner: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  securityText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  chatArea: { flex: 1, padding: 16 },
  chatContent: { paddingBottom: 20 },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  waitingText: { marginTop: 12, color: '#666', fontStyle: 'italic' },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    maxWidth: '95%',
  },
  messageText: { fontSize: 15, color: '#FFF', lineHeight: 22 },
  doctorText: { color: '#333' },
  systemTextHeader: {
    color: '#E65100',
    fontSize: 11,
    fontWeight: 'black',
    marginBottom: 4,
    textAlign: 'center',
  },
  systemText: {
    color: '#E65100',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
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
