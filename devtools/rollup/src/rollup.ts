import pluginBabel from '@rollup/plugin-babel';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import {
  defineConfig,
  type ExternalOption,
  type InputPluginOption,
  type OutputOptions,
  type RollupOptions,
  type WatcherOptions,
} from 'rollup';

function getOutput(pkg: Package): OutputOptions[] {
  if (typeof pkg.exports === 'string') {
    return [
      {
        file: pkg.exports,
        format: 'esm',
      },
    ];
  }

  if (pkg.exports['.']) {
    return [
      {
        file: pkg.exports['.'].import,
        format: 'esm',
      },
      {
        file: pkg.exports['.'].require,
        format: 'cjs',
      },
    ];
  }

  throw new Error('Invalid package `exports` field.');
}

type PackageExport = {
  import: string;
  require: string;
  types: string;
};

type Package = {
  main: string;
  entry: {
    main: string;
    cli?: string;
  };
  exports: Record<string, PackageExport> | string;
  bin?: string;
};

export function createRollupConfig(pkg: Package) {
  const output = getOutput(pkg);

  const external: ExternalOption = [
    /@coscan/,
    /node_modules/,
  ];
  const plugins: InputPluginOption = [
    pluginNodeResolve(),
    pluginBabel({
      babelHelpers: 'runtime',
      extensions: ['.ts'],
    }),
  ];

  const watch: WatcherOptions = {
    clearScreen: false,
  };

  const configs: RollupOptions[] = [{
    input: pkg.entry.main,
    output,
    external,
    plugins,
    watch,
  }];

  if (pkg.bin) {
    configs.push({
      input: pkg.entry.cli,
      output: {
        file: pkg.bin,
        format: 'esm',
        banner: '#!/usr/bin/env node',
      },
      external,
      plugins,
      watch,
    });
  }

  return defineConfig(configs);
}
