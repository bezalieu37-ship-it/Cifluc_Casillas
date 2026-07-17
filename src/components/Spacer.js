import React from 'react';
import { View } from 'react-native';

export default function Spacer({ size = 16, horizontal = false }) {
  if (horizontal) {
    return <View style={{ width: size }} />;
  }
  return <View style={{ height: size }} />;
}