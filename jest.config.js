module.exports = {
  bail: true,
  roots: ['<rootDir>/__tests__'],
  clearMocks: true,
  maxWorkers: 1,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/__tests__/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  testRegex: ['__tests__/.+(spec|test).ts']
}
