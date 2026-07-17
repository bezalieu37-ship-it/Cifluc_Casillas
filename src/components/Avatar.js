import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function Avatar({ source, initials, size = 40, style }) {
  if (source) {
    return (
      <Image
        source={source}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }, style]}
      />
    );
  }
  
  return (
    <View
      style={[
        styles.initials,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    // Image styles
  },
  initials: {
    backgroundColor: '#FFD400',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});