import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Flex({ children, direction = 'row', justify = 'flex-start', align = 'stretch', wrap = 'nowrap', style }) {
  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          flexWrap: wrap,
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