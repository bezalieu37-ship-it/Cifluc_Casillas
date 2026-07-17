import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export default function Toast({ message, visible, duration = 3000, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }
  }, [visible, duration, onHide, opacity]);
  
  if (!visible) return null;
  
  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 16,
    zIndex: 1000,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});