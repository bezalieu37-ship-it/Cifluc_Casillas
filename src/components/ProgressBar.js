import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ progress, label, showPercentage = true }) {
  const percentage = Math.min(100, Math.max(0, progress * 100));
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },
  bar: {
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFD400',
    borderRadius: 4,
  },
  percentage: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});