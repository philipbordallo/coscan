import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginTypescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  input: pkg.entry.main,
  output: [
    {
      dir: pkg.exports['.'].import.replace(/\/[^/]+$/, ''),
      format: 'esm',
      preserveModules: true,
    },
    {
      file: pkg.exports['.'].require,
      format: 'cjs',
    },
  ],
  external: [
    /node_modules/,
  ],
  plugins: [
    pluginNodeResolve(),
    pluginTypescript(),
  ],
  watch: {
    clearScreen: false,
  },
});
