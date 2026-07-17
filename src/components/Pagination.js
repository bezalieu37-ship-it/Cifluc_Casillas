import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, currentPage === 1 && styles.disabled]}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.buttonText}>Anterior</Text>
      </TouchableOpacity>
      
      <Text style={styles.page}>
        {currentPage} de {totalPages}
      </Text>
      
      <TouchableOpacity
        style={[styles.button, currentPage === totalPages && styles.disabled]}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  button: {
    backgroundColor: '#FFD400',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  disabled: {
    backgroundColor: '#333333',
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  page: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});