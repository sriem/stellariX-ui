import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['packages/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/examples/**', './packages/integrations/**'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['packages/**/*.{ts,tsx}'],
            exclude: [
                'packages/**/*.{test,spec}.{ts,tsx}',
                'packages/**/test/**',
                'packages/**/examples/**',
                'packages/**/types.ts',
                'packages/**/index.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@stellarix/core': resolve(__dirname, 'packages/core/src'),
            '@stellarix/utils': resolve(__dirname, 'packages/utils/src'),
        },
    },
}); 