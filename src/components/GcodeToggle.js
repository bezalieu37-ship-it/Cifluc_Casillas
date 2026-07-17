import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GcodeToggle({ gcodeAtivo, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, gcodeAtivo && styles.btnAtivo]}
        onPress={() => onToggle(true)}
      >
        <Text style={[styles.btnText, gcodeAtivo && styles.btnTextAtivo]}>ON</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, !gcodeAtivo && styles.btnInativo]}
        onPress={() => onToggle(false)}
      >
        <Text style={[styles.btnText, !gcodeAtivo && styles.btnTextInativo]}>OFF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#242424',
  },
  btnAtivo: {
    backgroundColor: '#FFD400',
  },
  btnInativo: {
    backgroundColor: '#FFD400',
  },
  btnText: {
    color: '#888888',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnTextAtivo: {
    color: '#000000',
  },
  btnTextInativo: {
    color: '#000000',
  },
});