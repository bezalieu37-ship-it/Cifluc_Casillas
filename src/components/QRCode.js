import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QRCode({ value, size = 200 }) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={styles.placeholder}>QR Code</Text>
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
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});