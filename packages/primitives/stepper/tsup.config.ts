import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  minify: true,
  external: [
    '@stellarix-ui/core',
    '@stellarix-ui/utils',
  ],
});