import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData.ts',
                '**/*.test.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@stellarix-ui/core': path.resolve(__dirname, '../../core/src'),
            '@stellarix-ui/utils': path.resolve(__dirname, '../../utils/src'),
        },
    },
});