import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function AvatarUpload({ source, onUpload, initials }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onUpload}>
      {source ? (
        <Image source={source} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.initials}>{initials || '+'}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});