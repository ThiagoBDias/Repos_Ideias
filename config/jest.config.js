/**
 * @fileoverview Configuração do Jest para testes automatizados
 * @description Setup completo para testes unitários, integração e e2e
 */

module.exports = {
  // Ambiente de teste
  testEnvironment: 'jsdom',
  
  // Extensões e transformações
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  // Padrões de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js',
  ],
  
  // Diretórios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Cobertura de código
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'assets/js/**/*.js',
    '!assets/js/vendor/**',
    '!**/node_modules/**',
    '!**/tests/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Módulos e aliases
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@js/(.*)$': '<rootDir>/assets/js/$1',
    '^@css/(.*)$': '<rootDir>/assets/css/$1',
  },
  
  // Timeout para testes
  testTimeout: 10000,
  
  // Reporter customizado
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Protocolo Renda Extra - Relatório de Testes',
        outputPath: 'coverage/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
  
  // Configurações avançadas
  verbose: true,
  clearMocks: true,
  restoreMocks: true,
  
  // Globais para testes
  globals: {
    'google': {},
    'OpenAI': {},
    'fetch': global.fetch,
  },
  
  // Setup para diferentes tipos de teste
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'Integration Tests',
      testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
      testEnvironment: 'jsdom',
    },
    {
      displayName: 'E2E Tests',
      testMatch: ['<rootDir>/tests/e2e/**/*.test.js'],
      testEnvironment: 'node',
      runner: '@jest-runner/electron',
    },
  ],
  
  // Watch mode configuration
  watchman: true,
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
  ],
};