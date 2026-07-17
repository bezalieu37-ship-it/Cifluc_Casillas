import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SuccessMessage({ message }) {
  if (!message) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});