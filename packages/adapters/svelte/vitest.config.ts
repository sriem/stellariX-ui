import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ compilerOptions: { hmr: false } })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
      ]
    }
  },
  resolve: {
    alias: {
      '@stellarix-ui/core': path.resolve(__dirname, '../../core/src'),
      '@': path.resolve(__dirname, './src')
    },
    conditions: ['development', 'browser']
  }
});