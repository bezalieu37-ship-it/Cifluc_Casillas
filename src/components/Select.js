import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Select({ label, options, value, onValueChange, placeholder }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.options}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, value === option && styles.optionAtivo]}
            onPress={() => onValueChange(option)}
          >
            <Text style={[styles.optionText, value === option && styles.optionTextAtivo]}>
              {option.label || option}
            </Text>
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
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionAtivo: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  optionText: {
    color: '#888888',
    fontSize: 12,
  },
  optionTextAtivo: {
    color: '#000000',
    fontWeight: 'bold',
  },
});