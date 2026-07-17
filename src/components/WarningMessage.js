import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WarningMessage({ message }) {
  if (!message) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  message: {
    color: '#000000',
    fontSize: 14,
  },
});