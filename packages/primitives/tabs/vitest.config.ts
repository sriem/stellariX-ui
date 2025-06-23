import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html']
        }
    },
    resolve: {
        alias: {
            '@stellarix/core': path.resolve(__dirname, '../../core/src'),
            '@stellarix/utils': path.resolve(__dirname, '../../utils/src')
        }
    }
});