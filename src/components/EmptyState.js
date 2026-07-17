import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ message = 'Nenhum dado encontrado' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    color: '#888888',
    fontSize: 14,
    textAlign: 'center',
  },
});