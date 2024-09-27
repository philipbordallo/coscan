# `@coscan/jsx-scanner`

> JSX implementation for coscan.

> [!NOTE]
> You probably don't need to use this package directly as it is intended to be used with [`coscan`](../coscan/README.md) and should be installed as a dependency of that package.

## Installation

```sh
npm add -D @coscan/jsx-scanner
```

## Usage

```js
import { jsxScanner } from '@coscan/jsx-scanner';

jsxScanner({
  files: ['src/app.tsx'],
});
```
