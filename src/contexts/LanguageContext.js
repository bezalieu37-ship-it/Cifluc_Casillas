import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DEFAULT_LANGUAGE,
  getTranslation,
  normalizeLanguageCode,
  t as translate
} from '../i18n';

const LANGUAGE_KEY = '@CIFLUC_LANGUAGE';
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState(getTranslation(DEFAULT_LANGUAGE));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadLanguage() {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (mounted && saved) {
          const normalized = normalizeLanguageCode(saved);
          setLangCode(normalized);
          setTranslations(getTranslation(normalized));
        }
      } catch {
        // Keep the default language when persisted preferences cannot be read.
      } finally {
        if (mounted) setReady(true);
      }
    }

    loadLanguage();

    return () => {
      mounted = false;
    };
  }, []);

  const changeLanguage = useCallback(async (code) => {
    const normalized = normalizeLanguageCode(code);
    setLangCode(normalized);
    setTranslations(getTranslation(normalized));

    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, normalized);
    } catch {
      // The selected language remains active for the current session.
    }
  }, []);

  const t = useCallback(
    (key, params) => translate(translations, key, params),
    [translations]
  );

  const contextValue = useMemo(
    () => ({ langCode, changeLanguage, t, ready }),
    [langCode, changeLanguage, t, ready]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
