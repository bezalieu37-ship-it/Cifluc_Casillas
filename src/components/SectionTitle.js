import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function SectionTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: '#FFD400',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});