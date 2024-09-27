# `@coscan/json-reporter`

> JSON reporter for coscan.

> [!NOTE]
> You probably don't need to use this package directly as it is intended to be used with [`coscan`](../coscan/README.md) and should be installed as a dependency of that package.

## Installation

```sh
npm add -D @coscan/json-reporter
```

## Usage

```js
import { jsonReporter } from '@coscan/json-reporter';
import { jsxScanner } from '@coscan/jsx-scanner';

async function main() {
  const discoveries = await jsxScanner({
    files,
  });

  if (reporter.type === 'json') {
    return jsonReporter(discoveries, { type: 'json', details: 'raw' });
  }
}

main();
```
