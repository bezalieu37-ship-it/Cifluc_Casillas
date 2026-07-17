import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Table({ headers, data, style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        {headers.map((header, index) => (
          <Text key={index} style={styles.headerText}>
            {header}
          </Text>
        ))}
      </View>
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => (
            <Text key={cellIndex} style={styles.cell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#242424',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  headerText: {
    flex: 1,
    color: '#FFD400',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  cell: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    padding: 12,
    textAlign: 'center',
  },
});