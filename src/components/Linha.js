import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Linha({ label, valor, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  label: {
    color: '#888888',
    fontSize: 14,
  },
  valor: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});