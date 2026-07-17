import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Stack({ children, spacing = 8, style }) {
  const items = React.Children.toArray(children);
  
  return (
    <View style={[styles.container, { gap: spacing }, style]}>
      {items.map((item, index) => (
        <View key={index}>{item}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
});