import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FileUpload({ label, onFileSelect, accept }) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.upload}>
        <Text style={styles.uploadText}>Selecionar arquivo</Text>
        <Text style={styles.uploadHint}>
          {accept || 'Todos os tipos de arquivo'}
        </Text>
      </TouchableOpacity>
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
  upload: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
  },
  uploadHint: {
    color: '#888888',
    fontSize: 12,
  },
});