import pluginBabel from '@rollup/plugin-babel';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import { defineConfig, type OutputOptions } from 'rollup';

type PackageExports = Record<string, { import: string; require: string; types: string }> | string;

function getOutput(pkgExports: PackageExports): OutputOptions[] {
  if (typeof pkgExports === 'string') {
    return [
      {
        file: pkgExports,
        format: 'esm',
      },
    ];
  }

  if (pkgExports['.']) {
    return [
      {
        file: pkgExports['.'].import,
        format: 'esm',
      },
      {
        file: pkgExports['.'].require,
        format: 'cjs',
      },
    ];
  }

  throw new Error('Invalid package `exports` field.');
}

type Package = {
  main: string;
  exports: PackageExports;
};

export function createRollupConfig(pkg: Package) {
  const output = getOutput(pkg.exports);

  return defineConfig({
    input: pkg.main,
    output,
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
    watch: {
      clearScreen: false,
    },
  });
}
