import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
    },
    resolve: {
        alias: {
            '@stellarix/core': path.resolve(__dirname, '../core/src'),
        },
    },
});