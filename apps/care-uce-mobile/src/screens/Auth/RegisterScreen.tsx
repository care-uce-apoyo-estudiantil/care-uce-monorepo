import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { User, Mail, Lock, FileDigit, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Importing Atoms and Hooks
import { InputWithIcon } from '../../components/atoms/InputWithIcon';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';

/**
 * RegisterScreen Component
 * Handles user registration with backend integration.
 */
export const RegisterScreen = () => {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();

  // Form state
  const [fullName, setFullName] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  /**
   * Valida el email institucional
   */
  const isValidEmail = (emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@uce\.edu\.ec$/;
    return emailRegex.test(emailToValidate.toLowerCase());
  };

  /**
   * Valida el formulario antes de registrar
   */
  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return false;
    }

    if (!enrollment.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu número de matrícula');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu email institucional');
      return false;
    }

    if (!isValidEmail(email)) {
      Alert.alert(
        'Email inválido',
        'Por favor usa un email institucional (@uce.edu.ec)',
      );
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor crea una contraseña');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  /**
   * Maneja el registro con validación
   */
  const handleRegister = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register(email.trim(), password);
      // Si el registro es exitoso, redirige al home
      Alert.alert('¡Éxito!', '¡Bienvenido a CareUCE!');
      router.replace('/home');
    } catch (err: any) {
      Alert.alert(
        'Error en el registro',
        error || 'Algo salió mal. Intenta nuevamente.',
      );
    }
  };

  /**
   * Navega de vuelta al login
   */
  const handleNavigateToLogin = () => {
    clearError();
    // Limpiar formulario
    setFullName('');
    setEnrollment('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a la red de apoyo CareUCE</Text>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Form Section */}
      <View style={styles.formContainer}>
        <InputWithIcon
          icon={User}
          placeholder="Nombre Completo"
          value={fullName}
          onChangeText={setFullName}
          editable={!isLoading}
        />

        <InputWithIcon
          icon={FileDigit}
          placeholder="Número de Matrícula"
          value={enrollment}
          onChangeText={setEnrollment}
          editable={!isLoading}
        />

        <InputWithIcon
          icon={Mail}
          placeholder="Email Institucional (@uce.edu.ec)"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />

        <InputWithIcon
          icon={Lock}
          placeholder="Crear Contraseña (mín. 6 caracteres)"
          secureTextEntry={!isPasswordVisible}
          rightIcon={isPasswordVisible ? EyeOff : Eye}
          onRightIconPress={() => setPasswordVisible(!isPasswordVisible)}
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />

        <InputWithIcon
          icon={Lock}
          placeholder="Confirmar Contraseña"
          secureTextEntry={!isConfirmPasswordVisible}
          rightIcon={isConfirmPasswordVisible ? EyeOff : Eye}
          onRightIconPress={() =>
            setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
          }
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!isLoading}
        />

        <View style={styles.buttonWrapper}>
          {isLoading ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          ) : (
            <PrimaryButton title="Registrarse" onPress={handleRegister} />
          )}
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={handleNavigateToLogin} disabled={isLoading}>
          <Text style={styles.loginLink}>Inicia Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F8F9FA',
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: { marginBottom: 40, marginTop: 20 },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#003366',
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, fontFamily: 'Inter-Regular', color: '#666666' },
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
  formContainer: { marginBottom: 30 },
  buttonWrapper: { marginTop: 15 },
  loadingButton: {
    backgroundColor: '#003366',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: { fontFamily: 'Inter-Regular', color: '#666666' },
  loginLink: { fontFamily: 'Inter-Bold', color: '#003366' },
});
