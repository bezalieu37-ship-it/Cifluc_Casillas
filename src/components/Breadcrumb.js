import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Breadcrumb({ items, onItemPress }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          {index > 0 && <Text style={styles.separator}>/</Text>}
          <TouchableOpacity
            onPress={() => onItemPress && onItemPress(item)}
            disabled={!onItemPress}
          >
            <Text style={[styles.text, index === items.length - 1 && styles.active]}>
              {item.label || item}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    color: '#888888',
    fontSize: 14,
    marginHorizontal: 8,
  },
  text: {
    color: '#888888',
    fontSize: 14,
  },
  active: {
    color: '#FFD400',
    fontWeight: 'bold',
  },
});