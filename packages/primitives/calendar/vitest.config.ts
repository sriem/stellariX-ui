/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}', 'test/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@stellarix-ui/core': path.resolve(__dirname, '../../../packages/core/src'),
      '@stellarix-ui/utils': path.resolve(__dirname, '../../../packages/utils/src'),
      '@stellarix-ui/react': path.resolve(__dirname, '../../../packages/adapters/react/src'),
    },
  },
})