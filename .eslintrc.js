module.exports = {
  extends: ['expo', 'prettier'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/no-unknown-property': 'off',
  },
  ignorePatterns: ['node_modules/', '__tests__/', 'scripts/', '*.config.js'],
};
