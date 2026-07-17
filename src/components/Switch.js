import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Switch({ label, value, onValueChange, style }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.switch, value && styles.switchOn]}
        onPress={() => onValueChange(!value)}
      >
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333333',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  switchOn: {
    backgroundColor: '#FFD400',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
});