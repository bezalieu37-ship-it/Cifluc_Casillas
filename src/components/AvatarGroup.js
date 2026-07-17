import React from 'react';
import { View, StyleSheet } from 'react-native';
import Avatar from './Avatar';

export default function AvatarGroup({ avatars, max = 3 }) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;
  
  return (
    <View style={styles.container}>
      {visibleAvatars.map((avatar, index) => (
        <View key={index} style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}>
          <Avatar source={avatar.source} initials={avatar.initials} size={32} />
        </View>
      ))}
      {remaining > 0 && (
        <View style={[styles.avatar, styles.remaining]}>
          <Avatar initials={`+${remaining}`} size={32} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatar: {
    // Avatar styles
  },
  remaining: {
    // Remaining styles
  },
});