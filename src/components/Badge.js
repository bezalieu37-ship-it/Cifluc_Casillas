import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ label, variant = 'default', style }) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'success':
        return styles.success;
      case 'danger':
        return styles.danger;
      case 'warning':
        return styles.warning;
      default:
        return styles.default;
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'success':
        return styles.successText;
      case 'danger':
        return styles.dangerText;
      case 'warning':
        return styles.warningText;
      default:
        return styles.defaultText;
    }
  };
  
  return (
    <View style={[styles.badge, getBadgeStyle(), style]}>
      <Text style={[styles.text, getTextStyle()]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#333333',
  },
  primary: {
    backgroundColor: '#38bdf8',
  },
  success: {
    backgroundColor: '#22c55e',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  warning: {
    backgroundColor: '#f59e0b',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  defaultText: {
    color: '#FFFFFF',
  },
  primaryText: {
    color: '#000000',
  },
  successText: {
    color: '#000000',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  warningText: {
    color: '#000000',
  },
});