
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}', '!**/tests/**'],
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react)/',
  ],
};

export default createJestConfig(config);
