import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Barcode({ value, height = 100 }) {
  return (
    <View style={[styles.container, { height }]}>
      <Text style={styles.placeholder}>Código de barras</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholder: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    color: '#888888',
    fontSize: 12,
  },
});