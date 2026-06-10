import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { User, Mail, Lock, FileDigit, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Importing Atoms
import { InputWithIcon } from '../../components/atoms/InputWithIcon';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';

/**
 * RegisterScreen Component
 * Handles the onboarding of new students/users into the CareUCE network.
 */
export const RegisterScreen = () => {
  const router = useRouter();

  // State management for form visibility and data
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  /**
   * Executes the registration workflow and redirects to the Home dashboard
   */
  const handleRegister = () => {
    // TODO: Implement backend registration logic
    console.log('Registering new user...');
    router.replace('/home');
  };

  /**
   * Navigates back to the Login screen
   */
  const handleNavigateToLogin = () => {
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

      {/* Form Section (Organism Level) */}
      <View style={styles.formContainer}>
        <InputWithIcon icon={User} placeholder="Nombre Completo" />

        <InputWithIcon icon={FileDigit} placeholder="Número de Matrícula" />

        <InputWithIcon
          icon={Mail}
          placeholder="Correo Institucional (@uce.edu.ec)"
        />

        <InputWithIcon
          icon={Lock}
          placeholder="Crear Contraseña"
          secureTextEntry={!isPasswordVisible}
          rightIcon={isPasswordVisible ? EyeOff : Eye}
          onRightIconPress={() => setPasswordVisible(!isPasswordVisible)}
        />

        <View style={styles.buttonWrapper}>
          <PrimaryButton title="Registrarse" onPress={handleRegister} />
        </View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={handleNavigateToLogin}>
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: { fontFamily: 'Inter-Regular', color: '#666666' },
  loginLink: { fontFamily: 'Inter-Bold', color: '#003366' },
});
