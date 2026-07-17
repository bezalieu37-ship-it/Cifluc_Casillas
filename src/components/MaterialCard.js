import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MaterialCard({ material, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.nome}>{material.nome}</Text>
      <Text style={styles.info}>Dureza: {material.dureza}</Text>
      <Text style={styles.info}>Vc HSS: {material.vcHss}</Text>
      <Text style={styles.info}>Vc Metal Duro: {material.vcMetalDuro}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0A0A0A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 12,
  },
  nome: {
    color: '#FFD400',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 4,
  },
});