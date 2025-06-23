import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@stellarix-ui/core': path.resolve(__dirname, '../../core/src'),
      '@stellarix-ui/utils': path.resolve(__dirname, '../../utils/src'),
    },
  },
});