import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Box({ children, padding = 0, margin = 0, background, borderRadius = 0, style }) {
  return (
    <View
      style={[
        styles.container,
        {
          padding,
          margin,
          backgroundColor: background,
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
});