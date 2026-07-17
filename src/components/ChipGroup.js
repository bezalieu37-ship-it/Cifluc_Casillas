import React from 'react';
import { View, StyleSheet } from 'react-native';
import Chip from './Chip';

export default function ChipGroup({ chips, selectedChip, onChipPress }) {
  return (
    <View style={styles.container}>
      {chips.map((chip, index) => (
        <Chip
          key={index}
          label={chip}
          selected={selectedChip === chip}
          onPress={() => onChipPress(chip)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});