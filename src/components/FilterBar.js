import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FilterBar({ filters, selectedFilter, onFilterPress }) {
  return (
    <View style={styles.container}>
      {filters.map((filter, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.filter, selectedFilter === filter && styles.filterAtivo]}
          onPress={() => onFilterPress(filter)}
        >
          <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextAtivo]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  filterAtivo: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  filterText: {
    color: '#888888',
    fontSize: 12,
  },
  filterTextAtivo: {
    color: '#000000',
    fontWeight: 'bold',
  },
});