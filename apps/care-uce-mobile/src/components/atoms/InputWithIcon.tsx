import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface InputProps {
  icon: LucideIcon;
  placeholder: string;
  secureTextEntry?: boolean;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

export const InputWithIcon = ({
  icon: Icon,
  placeholder,
  secureTextEntry,
  rightIcon: RightIcon,
  onRightIconPress,
  value,
  onChangeText,
  editable = true,
}: InputProps) => {
  return (
    <View style={styles.container}>
      <Icon color="#666" size={20} style={styles.icon} />
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
      />
      {RightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <RightIcon color="#666" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
    backgroundColor: '#FFFFFF',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontFamily: 'Inter', fontSize: 16, color: '#333' },
  disabledInput: { opacity: 0.6 },
});
