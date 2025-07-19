import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Import plugin configs using top-level await
const jestPlugin = (await import('eslint-plugin-jest')).default;
const jestConfig = (await import('eslint-plugin-jest')).configs.recommended;
const tsRecommended = tsPlugin.configs.recommended;

export default [
  // ✅ JavaScript base rules
  js.configs.recommended,

  // ✅ Backend
  {
    files: ['backend/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [path.join(__dirname, 'backend/tsconfig.json')],
        tsconfigRootDir: __dirname,
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsRecommended.rules,
    },
  },

  // ✅ Frontend
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [path.join(__dirname, 'frontend/tsconfig.json')],
        tsconfigRootDir: __dirname,
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tsRecommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // ✅ Test files
  {
    files: ['**/tests/**/*.test.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [path.join(__dirname, 'backend/tsconfig.json')],
        tsconfigRootDir: __dirname,
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      jest: jestPlugin,
    },
    rules: {
      ...tsRecommended.rules,
      ...jestConfig.rules,
    },
  },

  // ✅ Prettier config
  prettier,
];
