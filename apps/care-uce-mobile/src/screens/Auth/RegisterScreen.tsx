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
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  /**
   * Validates institutional email format
   */
  const isValidEmail = (emailToValidate: string): boolean => {
    const emailRegex = /^[^\s@]+@uce\.edu\.ec$/;
    return emailRegex.test(emailToValidate.toLowerCase());
  };

  /**
   * Pre-validates the form before calling the backend
   */
  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return false;
    }

    const isNumeric = /^\d+$/.test(cedula.trim());
    if (!cedula.trim() || cedula.trim().length !== 10 || !isNumeric) {
      Alert.alert(
        'Error',
        'La cédula debe tener exactamente 10 dígitos numéricos',
      );
      return false;
    }

    if (!isValidEmail(email)) {
      Alert.alert(
        'Email inválido',
        'Por favor usa un email institucional (@uce.edu.ec)',
      );
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  /**
   * Handles the registration process
   */
  const handleRegister = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      // Build the payload mapping our local state to the expected DTO properties
      const payload = {
        fullName: fullName.trim(),
        idCard: cedula.trim(), // Map cedula to idCard
        email: email.trim(),
        password,
        confirmPassword,
      };

      // Ensure your useAuth hook passes this entire object to authService.register
      await register(payload);

      Alert.alert('¡Éxito!', '¡Bienvenido a CareUCE!');
      router.replace('/home');
    } catch (err: unknown) {
      // ESLint fix: removed 'any'
      // Safely extract the message without assuming it's 'any'
      const errorMessage =
        (err as { message?: string })?.message ||
        error ||
        'Algo salió mal. Intenta nuevamente.';
      Alert.alert('Error en el registro', errorMessage);
    }
  };

  /**
   * Navigates back to login and clears the form
   */
  const handleNavigateToLogin = () => {
    clearError();
    setFullName('');
    setCedula('');
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
          placeholder="Número de Cédula (10 dígitos)"
          value={cedula}
          onChangeText={setCedula}
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
          placeholder="Crear Contraseña"
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
