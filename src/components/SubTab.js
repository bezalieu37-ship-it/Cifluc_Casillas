import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SubTab({ tabs, activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === tab && styles.tabAtivo]}
          onPress={() => onTabPress(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextAtivo]}>
            {tab}
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
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
  },
  tabAtivo: {
    backgroundColor: '#FFD400',
    borderColor: '#FFD400',
  },
  tabText: {
    color: '#888888',
    fontSize: 12,
  },
  tabTextAtivo: {
    color: '#000000',
    fontWeight: 'bold',
  },
});