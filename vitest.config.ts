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
        environment: 'happy-dom',
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
            '@stellarix-ui/core': resolve(__dirname, 'packages/core/src'),
            '@stellarix-ui/utils': resolve(__dirname, 'packages/utils/src'),
            '@stellarix-ui/react': resolve(__dirname, 'packages/adapters/react/src'),
            '@stellarix-ui/vue': resolve(__dirname, 'packages/adapters/vue/src'),
            '@stellarix-ui/svelte': resolve(__dirname, 'packages/adapters/svelte/src'),
            '@stellarix-ui/solid': resolve(__dirname, 'packages/adapters/solid/src'),
            '@stellarix-ui/button': resolve(__dirname, 'packages/primitives/button/src'),
            '@stellarix-ui/input': resolve(__dirname, 'packages/primitives/input/src'),
            '@stellarix-ui/checkbox': resolve(__dirname, 'packages/primitives/checkbox/src'),
            '@stellarix-ui/toggle': resolve(__dirname, 'packages/primitives/toggle/src'),
            '@stellarix-ui/select': resolve(__dirname, 'packages/primitives/select/src'),
            '@stellarix-ui/tabs': resolve(__dirname, 'packages/primitives/tabs/src'),
            '@stellarix-ui/tooltip': resolve(__dirname, 'packages/primitives/tooltip/src'),
            '@stellarix-ui/dialog': resolve(__dirname, 'packages/primitives/dialog/src'),
            '@stellarix-ui/menu': resolve(__dirname, 'packages/primitives/menu/src'),
            '@stellarix-ui/accordion': resolve(__dirname, 'packages/primitives/accordion/src'),
            '@stellarix-ui/alert': resolve(__dirname, 'packages/primitives/alert/src'),
            '@stellarix-ui/avatar': resolve(__dirname, 'packages/primitives/avatar/src'),
            '@stellarix-ui/badge': resolve(__dirname, 'packages/primitives/badge/src'),
            '@stellarix-ui/breadcrumb': resolve(__dirname, 'packages/primitives/breadcrumb/src'),
            '@stellarix-ui/calendar': resolve(__dirname, 'packages/primitives/calendar/src'),
            '@stellarix-ui/card': resolve(__dirname, 'packages/primitives/card/src'),
            '@stellarix-ui/container': resolve(__dirname, 'packages/primitives/container/src'),
            '@stellarix-ui/date-picker': resolve(__dirname, 'packages/primitives/date-picker/src'),
            '@stellarix-ui/divider': resolve(__dirname, 'packages/primitives/divider/src'),
            '@stellarix-ui/file-upload': resolve(__dirname, 'packages/primitives/file-upload/src'),
            '@stellarix-ui/navigation-menu': resolve(__dirname, 'packages/primitives/navigation-menu/src'),
            '@stellarix-ui/pagination': resolve(__dirname, 'packages/primitives/pagination/src'),
            '@stellarix-ui/popover': resolve(__dirname, 'packages/primitives/popover/src'),
            '@stellarix-ui/progress-bar': resolve(__dirname, 'packages/primitives/progress-bar/src'),
            '@stellarix-ui/radio': resolve(__dirname, 'packages/primitives/radio/src'),
            '@stellarix-ui/slider': resolve(__dirname, 'packages/primitives/slider/src'),
            '@stellarix-ui/spinner': resolve(__dirname, 'packages/primitives/spinner/src'),
            '@stellarix-ui/stepper': resolve(__dirname, 'packages/primitives/stepper/src'),
            '@stellarix-ui/table': resolve(__dirname, 'packages/primitives/table/src'),
            '@stellarix-ui/textarea': resolve(__dirname, 'packages/primitives/textarea/src'),
        },
    },
}); 