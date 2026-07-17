import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  StatusBar
} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Text style={styles.logo}>CIFLUC</Text>

      <Text style={styles.title}>
        Gemini Casillas
      </Text>

      <Text style={styles.subtitle}>
        APK em modo seguro iniciado com sucesso.
      </Text>

      <Text style={styles.info}>
        Se esta tela abrir no APK, o problema não está no EAS nem no Android.
        O erro estará em alguma tela, módulo nativo ou import do aplicativo completo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },

  logo: {
    color: '#FFD400',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 8
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10
  },

  subtitle: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18
  },

  info: {
    color: '#AAAAAA',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18
  }
});