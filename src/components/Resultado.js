import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Resultado({ label, valor, unidade }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>
        {valor} {unidade}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  label: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },
  valor: {
    color: '#FFD400',
    fontSize: 18,
    fontWeight: 'bold',
  },
});