# `@coscan/rollup`

> [Rollup](https://rollupjs.org) tools for development.

## Usage

`rollup.config.js`

```ts
import { createRollupConfig } from '@coscan/rollup';
import pkg from './package.json' with { type: 'json' };

export default createRollupConfig(pkg);
```
