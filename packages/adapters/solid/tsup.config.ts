import { defineConfig } from 'tsup';
import * as esbuildPluginSolid from 'esbuild-plugin-solid';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  splitting: false,
  external: ['solid-js', '@stellarix-ui/core'],
  platform: 'browser',
  target: 'es2020',
  esbuildPlugins: [esbuildPluginSolid.solidPlugin()],
});