import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Chart({ data, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>Gráfico</Text>
      <Text style={styles.data}>{JSON.stringify(data)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  data: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});