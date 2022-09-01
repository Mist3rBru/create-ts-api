module.exports = {
  bail: true,
  roots: ['<rootDir>/__tests__'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main/**',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest']
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/__tests__/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: ['mock*']
}
