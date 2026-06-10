import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon, ChevronRight } from 'lucide-react-native';

interface SupportCardProps {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  badgeText?: string;
  actionButton?: { text: string; onPress: () => void };
  onPress?: () => void;
}

export const SupportCard: React.FC<SupportCardProps> = ({
  title,
  subtitle,
  Icon,
  iconColor,
  iconBgColor,
  badgeText,
  actionButton,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon color={iconColor} size={24} />
      </View>
      
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {badgeText && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {actionButton ? (
        <TouchableOpacity style={styles.actionBtn} onPress={actionButton.onPress}>
          <Text style={styles.actionBtnText}>{actionButton.text}</Text>
        </TouchableOpacity>
      ) : (
        <ChevronRight color="#C0C0C0" size={24} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 8,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 13,
    color: '#666666',
  },
  badge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#28A745',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionBtn: {
    backgroundColor: '#003366',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});