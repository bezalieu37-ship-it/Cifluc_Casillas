import React from 'react';
import { View, StyleSheet } from 'react-native';
import ListItem from './ListItem';

export default function List({ items, onItemPress }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <ListItem
          key={index}
          title={item.title}
          subtitle={item.subtitle}
          onPress={onItemPress ? () => onItemPress(item) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
});