import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ChipInput({ label, chips, onChipsChange, placeholder }) {
  const [inputValue, setInputValue] = useState('');
  
  const addChip = () => {
    if (inputValue.trim() && !chips.includes(inputValue.trim())) {
      onChipsChange([...chips, inputValue.trim()]);
      setInputValue('');
    }
  };
  
  const removeChip = (index) => {
    const newChips = chips.filter((_, i) => i !== index);
    onChipsChange(newChips);
  };
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.chips}>
        {chips.map((chip, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{chip}</Text>
            <TouchableOpacity onPress={() => removeChip(index)}>
              <Text style={styles.chipRemove}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeholder}
          placeholderTextColor="#555555"
          onSubmitEditing={addChip}
        />
        <TouchableOpacity style={styles.addButton} onPress={addChip}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD400',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: '#000000',
    fontSize: 12,
    marginRight: 4,
  },
  chipRemove: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#FFD400',
    borderRadius: 8,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: 'bold',
  },
});