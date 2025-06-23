import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: false, // We'll handle this separately
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['@stellarix-ui/core'],
});