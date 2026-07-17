import React, { useEffect, useRef } from 'react';

import {
  View,
  StyleSheet,
  Animated,
  Image
} from 'react-native';

import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { useTheme } from '../contexts/ThemeContext';

const audioSource = require('../../assets/audio/intro.mp3');

export default function SplashScreen({ navigation }) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    let timer = null;
    let desmontado = false;

    async function iniciarAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          interruptionMode: 'mixWithOthers',
          shouldRouteThroughEarpiece: false
        });

        player.volume = 1.0;
        player.play();
      } catch (error) {
        console.log('ERRO AUDIO SPLASH:', error);
      }
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start();

    Animated.timing(progress, {
      toValue: 100,
      duration: 4200,
      useNativeDriver: false
    }).start();

    iniciarAudio();

    timer = setTimeout(() => {
      if (!desmontado) {
        navigation.replace('Dashboard');
      }
    }, 4200);

    return () => {
      desmontado = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [fadeAnim, progress, navigation, player]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageBox, { opacity: fadeAnim }]}>
        <Image
          source={require('../../assets/cifluc-splash.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  imageBox: {
    width: '100%',
    height: '88%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  image: {
    width: '100%',
    height: '100%'
  },

  progressContainer: {
    position: 'absolute',
    bottom: 55,
    width: 230,
    height: 8,
    backgroundColor: '#101010',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#005B8F'
  },

  progressBar: {
    height: 8,
    backgroundColor: '#00AEEF'
  }
});
