# `@coscan/devtools`

> A collection of utilities for development.

## Usage

### Babel

```json
{
  "extends": "@coscan/devtools/babel.config.json"
}
```

### Rollup

```ts
import { createRollupConfig } from '@coscan/devtools';
import pkg from './package.json' with { type: 'json' };

export default createRollupConfig(pkg);
```

### TypeScript

```json
{
  "extends": "@coscan/devtools/tsconfig.json"
}
```
