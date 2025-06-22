/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@stellarix/core': path.resolve(__dirname, '../../core/src'),
      '@stellarix/utils': path.resolve(__dirname, '../../utils/src'),
    },
  },
})