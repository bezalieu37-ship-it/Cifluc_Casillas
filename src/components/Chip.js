import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Chip({ label, selected, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selected, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  selected: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  text: {
    color: '#888888',
    fontSize: 12,
  },
  selectedText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});