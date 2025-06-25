import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    external: ['vue'],
    treeshake: true,
    splitting: false,
    minify: false,
    target: 'es2020',
});