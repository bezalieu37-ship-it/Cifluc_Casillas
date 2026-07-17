import React from 'react';
import { View, StyleSheet } from 'react-native';
import Container from './Container';
import Header from './Header';

export default function Page({ children, title, subtitle, style }) {
  return (
    <Container style={style}>
      <View style={styles.content}>
        {(title || subtitle) && <Header titulo={title} subtitulo={subtitle} />}
        {children}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});