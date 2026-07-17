import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';

export default function Container({ children, style }) {
  return (
    <ScrollView style={[styles.container, style]} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});