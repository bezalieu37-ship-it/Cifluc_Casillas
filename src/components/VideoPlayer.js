import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VideoPlayer({ source, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>Reprodutor de vídeo</Text>
      <Text style={styles.source}>{source}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  source: {
    color: '#888888',
    fontSize: 12,
  },
});