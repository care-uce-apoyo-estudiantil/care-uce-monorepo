import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../../constants/Theme';

interface DepartmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

export const DepartmentCard = ({
  title,
  description,
  icon,
  iconBgColor,
  onPress,
}: DepartmentCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <View style={styles.info}>
        <Text style={Typography.cardTitle}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
      <ChevronRight color={Colors.textTertiary} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  desc: { ...Typography.caption, paddingRight: 10, marginTop: 4 },
});
