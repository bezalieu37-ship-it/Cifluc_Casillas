import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';

export default function ButtonGroup({ buttons, activeButton, onButtonPress }) {
  return (
    <View style={styles.container}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          title={button.label || button}
          variant={activeButton === (button.value || button) ? 'primary' : 'secondary'}
          onPress={() => onButtonPress(button.value || button)}
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