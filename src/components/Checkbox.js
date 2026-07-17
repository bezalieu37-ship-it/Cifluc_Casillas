import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Checkbox({ label, checked, onChange, style }) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onChange(!checked)}
    >
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  checkmark: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});