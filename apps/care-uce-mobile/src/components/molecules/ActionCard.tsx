import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon, ChevronRight } from 'lucide-react-native';

/**
 * Props for the ActionCard molecule.
 * @param title - The main text displayed on the card.
 * @param Icon - The Lucide component to render.
 * @param isUnderConstruction - Flag to display the construction badge.
 * @param onPress - Callback function when the card is pressed.
 */
interface ActionCardProps {
  title: string;
  Icon: LucideIcon;
  isUnderConstruction?: boolean;
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  Icon,
  isUnderConstruction = true,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon color="#003366" size={32} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      
      {/* Renders the construction badge if the module is not ready */}
      {isUnderConstruction && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Under Construction</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    width: '47%', // Allows two cards per row in a flex-wrap container
  },
  iconContainer: {
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold', // Ensure Inter font is loaded
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  badgeContainer: {
    marginTop: 10,
    backgroundColor: '#FFF3CD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    color: '#856404',
    fontFamily: 'Inter-Medium',
  },
});