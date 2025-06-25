import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    react(),
    vue(),
    solid()
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.d.ts']
    },
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@stellarix-ui/core': new URL('../../core/src', import.meta.url).pathname,
      '@stellarix-ui/react': new URL('../../adapters/react/src', import.meta.url).pathname,
      '@stellarix-ui/vue': new URL('../../adapters/vue/src', import.meta.url).pathname,
      '@stellarix-ui/svelte': new URL('../../adapters/svelte/src', import.meta.url).pathname,
      '@stellarix-ui/solid': new URL('../../adapters/solid/src', import.meta.url).pathname,
    }
  }
});