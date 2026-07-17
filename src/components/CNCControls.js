import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CONTROLES_CNC } from '../data/cncData';

export default function CNCControls({ selected, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Controle CNC:</Text>
      <View style={styles.buttons}>
        {CONTROLES_CNC.map((controle) => (
          <TouchableOpacity
            key={controle}
            style={[styles.btn, selected === controle && styles.btnAtivo]}
            onPress={() => onSelect(controle)}
          >
            <Text style={[styles.btnText, selected === controle && styles.btnTextAtivo]}>
              {controle}
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
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  btnAtivo: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  btnText: {
    color: '#888888',
    fontSize: 12,
  },
  btnTextAtivo: {
    color: '#000000',
    fontWeight: 'bold',
  },
});