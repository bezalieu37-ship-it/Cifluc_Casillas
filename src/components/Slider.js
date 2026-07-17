import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Slider({ label, value, min, max, step, onValueChange }) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.slider}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.range}>
        <Text style={styles.rangeText}>{min}</Text>
        <Text style={styles.rangeText}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 8,
  },
  slider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
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
  value: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 12,
    minWidth: 40,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    color: '#888888',
    fontSize: 10,
  },
});