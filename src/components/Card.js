import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Card({ title, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 16,
  },
  title: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});