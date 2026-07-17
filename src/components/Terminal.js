import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function Terminal({ linhas, titulo }) {
  if (!linhas || linhas.length === 0) return null;
  
  return (
    <View style={styles.container}>
      {titulo && <Text style={styles.titulo}>{titulo}</Text>}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {linhas.map((linha, index) => (
          <Text key={index} style={styles.linha}>
            {linha}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    marginTop: 12,
  },
  titulo: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  scroll: {
    padding: 12,
    maxHeight: 200,
  },
  linha: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});