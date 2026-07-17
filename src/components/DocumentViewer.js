import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DocumentViewer({ source, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>Visualizador de documento</Text>
      <Text style={styles.source}>{source}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#000000',
    fontSize: 16,
    marginBottom: 8,
  },
  source: {
    color: '#888888',
    fontSize: 12,
  },
});