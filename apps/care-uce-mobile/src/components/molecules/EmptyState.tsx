import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/Theme';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onActionPress?: () => void;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  actionIcon,
  onActionPress,
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>

      {actionText && onActionPress && (
        <TouchableOpacity style={styles.button} onPress={onActionPress}>
          {actionIcon}
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 1.5,
    paddingHorizontal: Spacing.lg,
  },
  iconWrapper: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  desc: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.primaryText,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});
