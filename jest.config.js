module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  collectCoverageFrom: [
    'src/utils/**/*.js',
    'src/services/**/*.js',
  ],
};
