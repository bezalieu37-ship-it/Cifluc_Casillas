import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Rating({ label, value, maxValue = 5, onValueChange }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.stars}>
        {Array.from({ length: maxValue }, (_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onValueChange && onValueChange(index + 1)}
          >
            <Text style={[styles.star, index < value && styles.starFilled]}>
              {index < value ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
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
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 24,
    color: '#333333',
    marginRight: 4,
  },
  starFilled: {
    color: '#FFD400',
  },
});