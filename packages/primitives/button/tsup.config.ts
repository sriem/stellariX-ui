import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false, // Temporarily disable DTS to prevent build hang
    splitting: false,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    external: ['@stellarix/core', '@stellarix/utils'],
});