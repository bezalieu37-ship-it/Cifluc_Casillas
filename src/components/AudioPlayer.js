import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AudioPlayer({ source, onPlay, onPause, isPlaying }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={isPlaying ? onPause : onPlay}>
        <Text style={styles.buttonText}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title}>Áudio</Text>
        <Text style={styles.source}>{source}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    fontSize: 20,
    color: '#000000',
  },
  info: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  source: {
    color: '#888888',
    fontSize: 12,
  },
});