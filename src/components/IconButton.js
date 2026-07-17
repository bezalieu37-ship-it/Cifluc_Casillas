import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function IconButton({ icon, label, onPress, variant = 'primary', style }) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'danger':
        return styles.danger;
      case 'success':
        return styles.success;
      default:
        return styles.primary;
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'danger':
        return styles.dangerText;
      case 'success':
        return styles.successText;
      default:
        return styles.primaryText;
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
    >
      <Text style={[styles.icon, getTextStyle()]}>{icon}</Text>
      {label && <Text style={[styles.label, getTextStyle()]}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primary: {
    backgroundColor: '#FFD400',
  },
  secondary: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  success: {
    backgroundColor: '#22c55e',
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#000000',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  successText: {
    color: '#FFFFFF',
  },
});