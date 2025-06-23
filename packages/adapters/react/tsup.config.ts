import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: {
        resolve: true,
        compilerOptions: {
            composite: false,
            emitDeclarationOnly: false,
        },
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    target: 'es2022',
    tsconfig: './tsconfig.json',
    external: ['react', 'react-dom', '@stellarix-ui/core', '@stellarix-ui/utils'],
});