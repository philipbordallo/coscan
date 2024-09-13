import pluginBabel from '@rollup/plugin-babel';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';

type Package = {
  main: string;
  exports: Record<string, { import: string; require: string; types: string }>;
};

export function createRollupConfig(pkg: Package) {
  return defineConfig({
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
}
