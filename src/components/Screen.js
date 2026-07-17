import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Page from './Page';

export default function Screen({ children, title, subtitle, style }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Page title={title} subtitle={subtitle} style={style}>
        {children}
      </Page>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});