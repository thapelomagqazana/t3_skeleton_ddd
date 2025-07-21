import type { Config } from 'jest';
import dotenv from 'dotenv';

// Load env for test run
dotenv.config({ path: '../../.env' });

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  rootDir: './',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/../../packages/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/../../packages/infrastructure/$1',
    '^@domain/(.*)$': '<rootDir>/../../packages/domain/$1',
    '^@services/(.*)$': '<rootDir>/../../packages/services/src/$1',
    '^@interfaces/(.*)$': '<rootDir>/../../packages/interfaces/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json', // Point to app's tsconfig
    },
  },
};

export default config;
