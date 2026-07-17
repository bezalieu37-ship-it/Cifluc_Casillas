import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function InputCampo({ label, value, onChangeText, unidade, placeholder }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#555555"
          keyboardType="numeric"
        />
        {unidade && <Text style={styles.unidade}>{unidade}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
  },
  unidade: {
    color: '#888888',
    fontSize: 14,
    paddingRight: 12,
  },
});