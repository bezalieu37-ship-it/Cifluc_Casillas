import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapView({ style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.placeholder}>Visualização de mapa</Text>
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
    color: '#888888',
    fontSize: 16,
  },
});