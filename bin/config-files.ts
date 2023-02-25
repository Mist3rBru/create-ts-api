export const configFiles = {
  'package.json': {
    version: '0.0.1',
    name: '@mist3rbru/create-ts-api',
    description: '🎉Enjoy your template🎉',
    license: 'MIT',
    scripts: {
      start: 'node dist/server.js',
      dev: 'tsx watch src/server.ts',
      clean: 'rimraf dist coverage',
      lint: 'prettier --write . && eslint --fix .',
      tsc: 'tsc -p tsconfig.build.json',
      'tsc:lint': 'tsc -p tsconfig.json --noEmit',
      build: 'run-s clean tsc',
      test: 'jest --no-cache',
      'test:w': 'npm test -- --watch',
      'test:ci': 'npm test -- --silent --coverage'
    },
    dependencies: {
      dotenv: '^16.0.3',
      'module-alias': '^2.2.2'
    },
    devDependencies: {
      '@faker-js/faker': '^7.6.0',
      '@swc/core': '^1.3.36',
      '@swc/jest': '^0.2.24',
      '@trivago/prettier-plugin-sort-imports': '^4.1.1',
      '@types/jest': '^29.4.0',
      '@types/node': '^18.14.1',
      '@typescript-eslint/eslint-plugin': '^5.53.0',
      '@typescript-eslint/parser': '^5.53.0',
      eslint: '^8.34.0',
      'eslint-config-standard-with-typescript': '^34.0.0',
      'eslint-plugin-import': '^2.27.5',
      'eslint-plugin-jest': '^27.2.1',
      'eslint-plugin-n': '^15.6.1',
      'eslint-plugin-promise': '^6.1.1',
      'git-commit-msg-linter': '^4.7.3',
      jest: '^29.4.3',
      'npm-run-all': '^4.1.5',
      prettier: '^2.8.4',
      rimraf: '^4.1.2',
      tsx: '^3.12.3',
      typescript: '^4.9.5'
    },
    _moduleAliases: {
      '@': 'dist'
    }
  },
  'tsconfig.json': {
    compilerOptions: {
      target: 'ES6',
      outDir: 'dist',
      module: 'NodeNext',
      moduleResolution: 'node',
      esModuleInterop: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      useUnknownInCatchVariables: false,
      strictPropertyInitialization: false,
      baseUrl: '.',
      paths: {
        '@/tests/*': ['__tests__/*'],
        '@/*': ['src/*']
      }
    }
  },
  'tsconfig.build.json': {
    extends: './tsconfig.json',
    exclude: ['__tests__', 'dist', 'coverage']
  },
  '.eslintrc.json': {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json'
    },
    plugins: ['@typescript-eslint'],
    extends: ['standard-with-typescript'],
    env: {
      es2022: true,
      node: true,
      'jest/globals': true
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/indent': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports'
        }
      ],
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNullish: true, allowAny: true }
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignoreConditionalTests: true }
      ],
      '@typescript-eslint/space-before-function-paren': [
        'error',
        { named: 'never' }
      ],
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreVoidOperator: true }
      ],
      '@typescript-eslint/brace-style': [
        'error',
        '1tbs',
        { allowSingleLine: false }
      ],

      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'prefer-template': 'error',
      'multiline-ternary': 'off',
      'no-void': 'off'
    },
    overrides: [
      {
        files: ['__tests__/**'],
        plugins: ['jest'],
        extends: ['plugin:jest/all'],
        rules: {
          'jest/prefer-lowercase-title': ['error', { ignore: ['describe'] }],
          'jest/prefer-expect-assertions': 'off',
          'jest/require-to-throw-message': 'off',
          'jest/no-untyped-mock-factory': 'off',
          'jest/unbound-method': 'off',
          'jest/no-hooks': 'off',
          'jest/max-expects': ['error', { max: 10 }],
          'jest/no-disabled-tests': 'warn',

          'no-extra-semi': 'off'
        }
      }
    ]
  },
  '.prettierrc.json': {
    endOfLine: 'crlf',
    arrowParens: 'avoid',
    bracketSpacing: true,
    useTabs: false,
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    tabWidth: 2,
    printWidth: 80
  },
  'jest.config.json': {
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
}
