import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { User, Lock, Eye, EyeOff, Shield } from 'lucide-react-native';
import { InputWithIcon } from '../../components/atoms/InputWithIcon';
import { PrimaryButton } from '../../components/atoms/PrimaryButton';
import { SocialAuth } from '../../components/molecules/SocialAuth';

export const LoginScreen = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Shield color="#003366" size={64} strokeWidth={2} />
        <Text style={styles.logoText}>CareUCE</Text>
      </View>

      <View style={styles.floatingContainer}>
        <InputWithIcon icon={User} placeholder="Cédula o Matrícula" />
        <InputWithIcon 
          icon={Lock} 
          placeholder="Contraseña" 
          secureTextEntry={!isPasswordVisible}
          rightIcon={isPasswordVisible ? EyeOff : Eye}
          onRightIconPress={() => setPasswordVisible(!isPasswordVisible)}
        />

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Ingresar" onPress={() => console.log("Login...")} />

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O CONTINUAR CON</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialAuth />

        <View style={styles.registerContainer}>
          <Text style={styles.regularText}>¿No tienes cuenta? </Text>
          <TouchableOpacity><Text style={styles.linkTextBold}>Regístrate</Text></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', justifyContent: 'center', paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontFamily: 'Inter', fontSize: 24, fontWeight: 'bold', color: '#003366', marginTop: 10 },
  floatingContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 3 },
    }),
  },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  linkText: { color: '#003366', fontFamily: 'Inter', fontSize: 14 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { marginHorizontal: 10, color: '#999', fontFamily: 'Inter', fontSize: 12 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center' },
  regularText: { color: '#666', fontFamily: 'Inter', fontSize: 14 },
  linkTextBold: { color: '#003366', fontFamily: 'Inter', fontSize: 14, fontWeight: 'bold' },
});