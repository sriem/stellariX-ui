import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        environment: 'happy-dom',
        globals: true,
        setupFiles: ['./test/setup.ts'],
    },
    resolve: {
        alias: {
            '@stellarix-ui/core': resolve(__dirname, '../../core/src'),
            '@stellarix-ui/utils': resolve(__dirname, '../../utils/src'),
            '@stellarix-ui/react': resolve(__dirname, '../../adapters/react/src'),
        },
    },
});