import { TextStyle } from 'react-native';

// Átomos Fundacionales: COLORES
export const Colors = {
  // Institucionales UCE
  primary: '#003366', // Azul UCE
  primaryLight: '#E8F0FE',
  primaryText: '#FFFFFF',

  // UI Base
  background: '#F8F9FA',
  surface: '#FFFFFF',
  border: '#E0E0E0',

  // Texto
  text: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',

  // Semánticos
  crisis: '#D32F2F', // Rojo Pánico
  crisisText: '#FFFFFF',
  crisisSub: '#FFCDD2',

  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#E65100',
  warningLight: '#FFF3E0',
};

// Átomos Fundacionales: ESPACIADOS (paddings/margins)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Átomos Fundacionales: TIPOGRAFÍA
// (Usaremos Inter, asegurate de tenerla cargada en tu app o usa fuentes del sistema)
export const Typography: { [key: string]: TextStyle } = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    fontFamily: 'Inter-Bold', // Ajusta si usas otra fuente cargada
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: 'Inter-Bold',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: 'Inter-Bold',
  },
  body: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.crisisText,
    fontFamily: 'Inter-Bold',
  },
  emergencySub: {
    fontSize: 13,
    color: Colors.crisisSub,
    fontFamily: 'Inter-Regular',
  },
};
