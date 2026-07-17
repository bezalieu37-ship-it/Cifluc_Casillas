import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dark from '../themes/dark';
import light from '../themes/light';

const THEME_KEY = '@CIFLUC_THEME';
const ThemeContext = createContext();

function resolveTheme(mode) {
  if (mode === 'system') {
    const scheme = Appearance.getColorScheme();
    return scheme === 'light' ? light : dark;
  }
  return mode === 'light' ? light : dark;
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [theme, setTheme] = useState(dark);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved) {
        setMode(saved);
        setTheme(resolveTheme(saved));
      }
      setReady(true);
    });

    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        setTheme(colorScheme === 'light' ? light : dark);
      }
    });

    return () => listener?.remove();
  }, []);

  const changeTheme = async (newMode) => {
    setMode(newMode);
    setTheme(resolveTheme(newMode));
    await AsyncStorage.setItem(THEME_KEY, newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, theme, changeTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
