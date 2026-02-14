import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(), // respect tsconfig paths aliases
  ],
  // shared server settings (useful for all)
  server: {
    port: 5173,
    strictPort: true,
  },
  // shared test settings (Vitest inherits these)
  test: {
    globals: true,
    environment: 'node', // default for backend services
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
