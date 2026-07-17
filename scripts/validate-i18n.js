const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const LOCALES = {
  'pt-BR': path.join(ROOT, 'src/i18n/pt-BR.js'),
  en: path.join(ROOT, 'src/i18n/en.js'),
  es: path.join(ROOT, 'src/i18n/es.js'),
  fr: path.join(ROOT, 'src/i18n/fr.js')
};

function loadLocale(filePath) {
  let source = fs.readFileSync(filePath, 'utf8');
  source = source.replace(/export default [A-Za-z0-9_]+;?\s*$/, '');

  const declaration = source.match(/const\s+([A-Za-z0-9_]+)\s*=/);
  if (!declaration) throw new Error(`Objeto de tradução não encontrado em ${filePath}`);

  source += `\n;globalThis.__locale = ${declaration[1]};`;
  const context = {};
  vm.createContext(context);
  vm.runInContext(source, context, { filename: filePath });
  return context.__locale;
}

function flatten(value, prefix = '', output = {}) {
  Object.entries(value).forEach(([key, child]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      flatten(child, fullKey, output);
    } else {
      output[fullKey] = child;
    }
  });
  return output;
}

function placeholders(value) {
  return [...String(value).matchAll(/\{([A-Za-z0-9_]+)\}/g)]
    .map((match) => match[1])
    .sort()
    .join(',');
}

function javascriptFiles(directory, output = []) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    if (['node_modules', '.git', 'dist'].includes(entry.name)) return;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) javascriptFiles(fullPath, output);
    else if (entry.isFile() && entry.name.endsWith('.js')) output.push(fullPath);
  });
  return output;
}

const localeMaps = Object.fromEntries(
  Object.entries(LOCALES).map(([language, filePath]) => [language, flatten(loadLocale(filePath))])
);
const base = localeMaps['pt-BR'];
const errors = [];

Object.entries(localeMaps).forEach(([language, values]) => {
  Object.keys(base).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      errors.push(`[${language}] chave ausente: ${key}`);
      return;
    }
    if (typeof values[key] !== 'string' || values[key].trim() === '') {
      errors.push(`[${language}] valor vazio ou inválido: ${key}`);
    }
    if (placeholders(values[key]) !== placeholders(base[key])) {
      errors.push(`[${language}] placeholders divergentes: ${key}`);
    }
  });

  Object.keys(values).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(base, key)) {
      errors.push(`[${language}] chave extra: ${key}`);
    }
  });
});

const staticTranslationCall = /\bt\(\s*['"]([^'"]+)['"]/g;
javascriptFiles(ROOT).forEach((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  for (const match of source.matchAll(staticTranslationCall)) {
    if (!Object.prototype.hasOwnProperty.call(base, match[1])) {
      errors.push(`[código] ${path.relative(ROOT, filePath)} usa chave inexistente: ${match[1]}`);
    }
  }
});

if (errors.length) {
  console.error(`Validação i18n falhou com ${errors.length} erro(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const keyCount = Object.keys(base).length;
console.log(`i18n válido: ${Object.keys(localeMaps).length} idiomas e ${keyCount} chaves por idioma.`);
