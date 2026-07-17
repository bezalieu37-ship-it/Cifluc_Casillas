import ptBR from './pt-BR';
import en from './en';
import es from './es';
import fr from './fr';

const translations = { 'pt-BR': ptBR, en, es, fr };

export const DEFAULT_LANGUAGE = 'pt-BR';

export const LANGUAGES = [
  { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }
];

export function normalizeLanguageCode(langCode) {
  if (typeof langCode !== 'string') return DEFAULT_LANGUAGE;

  const normalized = langCode.trim().replace('_', '-').toLowerCase();
  if (normalized === 'pt' || normalized.startsWith('pt-')) return 'pt-BR';
  if (normalized === 'en' || normalized.startsWith('en-')) return 'en';
  if (normalized === 'es' || normalized.startsWith('es-')) return 'es';
  if (normalized === 'fr' || normalized.startsWith('fr-')) return 'fr';

  return DEFAULT_LANGUAGE;
}

export function getTranslation(langCode) {
  return translations[normalizeLanguageCode(langCode)];
}

export function t(translationsObj, key, params) {
  if (!translationsObj || typeof key !== 'string' || key.length === 0) return key;
  const keys = key.split('.');
  let value = translationsObj;
  for (const k of keys) {
    if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, k)) {
      value = value[k];
    } else {
      return key;
    }
  }
  if (typeof value !== 'string') return key;
  if (params) {
    Object.keys(params).forEach((p) => {
      value = value.replace(new RegExp(`\\{${p}\\}`, 'g'), String(params[p]));
    });
  }
  return value;
}
