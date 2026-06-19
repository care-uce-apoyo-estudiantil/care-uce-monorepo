import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import {
  Home,
  Calendar,
  MessageSquareWarning,
  User as UserIcon,
  Menu,
} from 'lucide-react-native';
import { Sidebar } from '../../components/organisms/Sidebar';

export default function TabLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const router = useRouter();

  // Esta es tu nueva barra superior GLOBAL
  const CustomHeader = () => (
    <SafeAreaView style={{ backgroundColor: '#003366' }}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBarButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Menu color="#FFFFFF" size={26} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>CareUCE</Text>
        <TouchableOpacity
          style={styles.avatarCircle}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <UserIcon color="#003366" size={18} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          header: () => <CustomHeader />, // Aplicamos la cabecera a TODAS las pestañas
          headerShown: true, // Lo volvemos a encender
          tabBarActiveTintColor: '#003366',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: { height: 60, paddingBottom: 10, paddingTop: 10 },
          tabBarLabelStyle: { fontFamily: 'Inter', fontSize: 12 },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: 'Mis Citas',
            tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="crisis"
          options={{
            title: 'Crisis',
            tabBarIcon: ({ color }) => (
              <MessageSquareWarning color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <UserIcon color={color} size={24} />,
          }}
        />
      </Tabs>

      {/* Aquí insertamos el Sidebar para que esté disponible en toda la app */}
      <Sidebar
        visible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#003366',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Evita solapamiento en Android
  },
  topBarButton: { padding: 6 },
  topBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Inter',
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
