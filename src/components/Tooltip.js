import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Tooltip({ children, content }) {
  const [visible, setVisible] = useState(false);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        onLongPress={() => setVisible(true)}
      >
        {children}
      </TouchableOpacity>
      {visible && (
        <View style={styles.tooltip}>
          <Text style={styles.content}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#333333',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    zIndex: 1000,
  },
  content: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});