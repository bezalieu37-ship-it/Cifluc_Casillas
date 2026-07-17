import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ColorPicker({ label, colors, selectedColor, onColorSelect }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.colors}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.color,
              { backgroundColor: color.value },
              selectedColor === color.value && styles.selected,
            ]}
            onPress={() => onColorSelect(color.value)}
          >
            {selectedColor === color.value && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
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
    marginBottom: 8,
  },
  colors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});