import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';

export default function SpeedDial({ actions }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.actions}>
          {actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.action, { marginBottom: 12 }]}
              onPress={() => {
                action.onPress();
                setIsOpen(false);
              }}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity
        style={[styles.fab, isOpen && styles.fabOpen]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.fabIcon}>{isOpen ? '×' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
  },
  actions: {
    alignItems: 'center',
    marginBottom: 12,
  },
  action: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  fab: {
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
  fabOpen: {
    backgroundColor: '#ef4444',
  },
  fabIcon: {
    fontSize: 24,
    color: '#000000',
  },
});