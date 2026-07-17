import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { formatarGcode } from '../utils/formatters';

export default function GCodeDisplay({ codigo, titulo }) {
  const [expandido, setExpandido] = useState(false);
  
  if (!codigo) return null;
  
  const linhas = codigo.split('\n');
  const linhasVisiveis = expandido ? linhas : linhas.slice(0, 5);
  
  const copiarParaAreaDeTransferencia = async () => {
    try {
      await Share.share({
        message: codigo,
      });
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{titulo || 'G-Code Gerado'}</Text>
        <TouchableOpacity style={styles.btnCopiar} onPress={copiarParaAreaDeTransferencia}>
          <Text style={styles.btnCopiarText}>Copiar</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.codeContainer} showsVerticalScrollIndicator={false}>
        {linhasVisiveis.map((linha, index) => (
          <Text key={index} style={styles.linha}>
            {linha}
          </Text>
        ))}
      </ScrollView>
      
      {linhas.length > 5 && (
        <TouchableOpacity
          style={styles.btnExpandir}
          onPress={() => setExpandido(!expandido)}
        >
          <Text style={styles.btnExpandirText}>
            {expandido ? 'Recolher' : 'Expandir'}
          </Text>
        </TouchableOpacity>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  titulo: {
    color: '#FFD400',
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnCopiar: {
    backgroundColor: '#FFD400',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  btnCopiarText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  codeContainer: {
    padding: 12,
    maxHeight: 200,
  },
  linha: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  btnExpandir: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    alignItems: 'center',
  },
  btnExpandirText: {
    color: '#FFD400',
    fontSize: 12,
  },
});