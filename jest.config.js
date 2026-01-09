export default {
  // Use Node test environment
  testEnvironment: 'node',

  // Transform ESM modules
  transform: {},

  // Match test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js', // Exclude server entry point
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
  ],

  // Coverage threshold
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Verbose output
  verbose: true,

  // Module name mapper for absolute imports (if needed)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
