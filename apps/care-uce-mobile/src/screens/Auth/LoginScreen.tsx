import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { User, Lock, Eye, EyeOff, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Importing Atoms and Molecules
import { InputWithIcon } from '../../components/atoms/InputWithIcon';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';
import { SocialAuth } from '../../components/molecules/SocialAuth';
import { useAuth } from '../../hooks/useAuth';

/**
 * LoginScreen Component
 * Handles user authentication with backend integration.
 */
export const LoginScreen = () => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  /**
   * Maneja el login con validación y error handling
   */
  const handleLogin = async () => {
    clearError();

    // Validación básica
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email o matrícula');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    try {
      await login(email.trim(), password);
      // Si el login es exitoso, el router lo maneja automáticamente
      router.replace('/home');
    } catch (err: any) {
      Alert.alert('Error de autenticación', error || 'Credenciales inválidas');
    }
  };

  /**
   * Navega a la pantalla de registro
   */
  const handleNavigateToRegister = () => {
    clearError();
    setEmail('');
    setPassword('');
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.logoContainer}>
        <Shield color="#003366" size={64} strokeWidth={2} />
        <Text style={styles.logoText}>CareUCE</Text>
      </View>

      {/* Main Authentication Form */}
      <View style={styles.floatingContainer}>
        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <InputWithIcon
          icon={User}
          placeholder="Email o Matrícula"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />

        <InputWithIcon
          icon={Lock}
          placeholder="Contraseña"
          secureTextEntry={!isPasswordVisible}
          rightIcon={isPasswordVisible ? EyeOff : Eye}
          onRightIconPress={() => setPasswordVisible(!isPasswordVisible)}
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />

        <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {/* Login Button con Loading State */}
        {isLoading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : (
          <PrimaryButton title="Ingresar" onPress={handleLogin} />
        )}

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O CONTINUAR CON</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialAuth />

        {/* Footer Navigation */}
        <View style={styles.registerContainer}>
          <Text style={styles.regularText}>¿No tienes cuenta? </Text>
          <TouchableOpacity
            onPress={handleNavigateToRegister}
            disabled={isLoading}
          >
            <Text style={styles.linkTextBold}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 10,
  },
  floatingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 3 },
    }),
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#CC3333',
  },
  errorText: {
    color: '#CC3333',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  linkText: { color: '#003366', fontFamily: 'Inter', fontSize: 14 },
  loadingButton: {
    backgroundColor: '#003366',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontFamily: 'Inter',
    fontSize: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  regularText: { color: '#666', fontFamily: 'Inter', fontSize: 14 },
  linkTextBold: {
    color: '#003366',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
