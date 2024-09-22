import pluginBabel from '@rollup/plugin-babel';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  input: pkg.main,
  output: [
    {
      file: pkg.exports['.'].import,
      format: 'esm',
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
    pluginBabel({
      babelHelpers: 'runtime',
      extensions: ['.ts'],
    }),
  ],
  watch: {
    clearScreen: false,
  },
});
