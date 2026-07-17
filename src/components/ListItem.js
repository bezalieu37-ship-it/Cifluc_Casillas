import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ListItem({ title, subtitle, onPress, style }) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container style={[styles.container, style]} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {onPress && <Text style={styles.arrow}>▶</Text>}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#888888',
    fontSize: 14,
  },
  arrow: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 12,
  },
});