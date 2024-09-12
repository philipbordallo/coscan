import pluginBabel from '@rollup/plugin-babel';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import path from 'node:path';
import { defineConfig } from 'rollup';
import pkg from './package.json' with { type: 'json' };

const esmDirectory = path.dirname(pkg.exports['.'].import);
const cjsDirectory = path.dirname(pkg.exports['.'].require);

export default defineConfig({
  input: pkg.main,
  output: [
    {
      dir: esmDirectory,
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: './src',
    },
    {
      dir: cjsDirectory,
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: './src',
    },
  ],
  external: [
    /@coscan/,
    /node_modules/,
  ],
  plugins: [
    pluginNodeResolve(),
    pluginBabel({
      babelHelpers: 'runtime',
      extensions: ['.ts'],
    }),
  ],
});
