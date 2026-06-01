import { defineConfig } from 'vitest/config';

// Vitest runs in a jsdom environment because the ingest pipeline pulls in the
// zustand `persist` store (which touches `localStorage`) and `import.meta.env`.
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
