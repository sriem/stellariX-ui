import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  minify: true,
  target: 'es2022',
  external: [
    '@stellarix-ui/core',
    '@stellarix-ui/utils',
  ],
});