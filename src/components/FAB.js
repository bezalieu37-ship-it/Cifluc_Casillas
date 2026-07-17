import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FAB({ icon, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.fab, style]} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 24,
    color: '#000000',
  },
});