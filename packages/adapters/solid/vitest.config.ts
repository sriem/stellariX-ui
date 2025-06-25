import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    globals: true,
    environment: 'happy-dom',
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/*',
      ],
    },
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    conditions: ['development', 'browser'],
    alias: {
      '@stellarix-ui/core': path.resolve(__dirname, '../../core/src'),
    },
  },
  esbuild: {
    jsx: 'transform',
    jsxFactory: '_$createComponent',
    jsxFragment: '_$Fragment',
    jsxInject: `import { createComponent as _$createComponent, Fragment as _$Fragment } from 'solid-js/web'`,
  },
});