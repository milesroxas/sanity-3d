import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'server-only': path.resolve(__dirname, 'src/test/mocks/server-only.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, 'src/test/setup.ts')],
    exclude: ['node_modules', '.next', 'dist'],
    coverage: {
      reporter: ['text', 'html'],
    },
    fakeTimers: {
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'Date',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    },
  },
});
