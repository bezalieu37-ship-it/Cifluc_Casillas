import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Radio({ options, selected, onSelect, style }) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => onSelect(option.value || option)}
        >
          <View style={[styles.radio, selected === (option.value || option) && styles.radioSelected]}>
            {selected === (option.value || option) && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.label}>{option.label || option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#FFD400',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD400',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});