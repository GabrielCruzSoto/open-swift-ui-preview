module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/tests/basic.test.ts'],
  collectCoverageFrom: [
    'src/parser/**/*.ts',
    '!src/parser/index.ts',
    '!src/parser/types.ts',
    'src/renderer/**/*.ts',
    '!src/renderer/index.ts',
    '!src/renderer/types.ts',
  ],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};
