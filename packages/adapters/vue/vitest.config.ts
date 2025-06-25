import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        alias: {
            '@': new URL('./src', import.meta.url).pathname,
        },
    },
});