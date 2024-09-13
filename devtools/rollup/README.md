# `@coscan/devtools`

> A collection of utilities for development.

## Usage

### Babel

`babel.config.json`

```json
{
  "extends": "@coscan/devtools/babel.config.json"
}
```

### Rollup

`rollup.config.js`

```ts
import { createRollupConfig } from '@coscan/devtools';
import pkg from './package.json' with { type: 'json' };

export default createRollupConfig(pkg);
```

### TypeScript

`tsconfig.json`

```json
{
  "extends": "@coscan/devtools/tsconfig.json"
}
```
