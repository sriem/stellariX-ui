import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    external: ['react', 'vue', 'svelte', 'solid-js', '@angular/core', '@stellarix-ui/core', '@stellarix-ui/utils'],
});