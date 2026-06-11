import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
// Importamos nuestro Theme
import { Colors, Spacing, Typography } from '../../constants/Theme';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

export const ActionCard = ({
  title,
  description,
  icon,
  iconBgColor,
  onPress,
}: ActionCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      {/* Usamos tipografía del tema */}
      <Text style={Typography.cardTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={1}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface, // Usamos colores del tema
    width: '48%',
    borderRadius: 14,
    padding: Spacing.md, // Usamos espaciado del tema
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardDesc: {
    ...Typography.caption, // Heredamos estilo base
    marginTop: Spacing.xs,
  },
});
