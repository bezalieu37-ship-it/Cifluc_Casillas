import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DatePicker({ label, value, onValueChange, placeholder }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || placeholder || 'Selecionar data'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 12,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholder: {
    color: '#555555',
  },
});