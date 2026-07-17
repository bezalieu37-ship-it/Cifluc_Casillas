import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Grid({ children, columns = 2, style }) {
  const items = React.Children.toArray(children);
  const rows = [];
  
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }
  
  return (
    <View style={[styles.container, style]}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, itemIndex) => (
            <View key={itemIndex} style={[styles.item, { flex: 1 }]}>
              {item}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Container styles
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  item: {
    // Item styles
  },
});