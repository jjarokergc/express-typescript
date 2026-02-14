/// <reference types="vitest" />
import { defineConfig } from 'vite';
import baseConfig from '@example-org/vite-config'; // Workspace package

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    environment: 'node', // override if needed
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
