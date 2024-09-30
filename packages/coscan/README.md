# [`coscan`](https://www.npmjs.com/package/coscan)

> CLI and Node.js API implementations of coscan.

## Installation

```sh
npm add -D coscan
```

## Usage

### CLI

```sh
npx coscan src/app.tsx --output results.json
```

#### Configuration

| Flag              | Type                    | Description                       |
| ----------------- | ----------------------- | --------------------------------- |
| `--output` `-o`   | `string`                | Output file for the scan results. |
| `--reporter` `-r` | `json:raw` `json:count` | Reporter to use for output.       |

### Node.js API

```js
import { coscan } from 'coscan';

coscan({
  files: ['src/app.tsx'],
});
```

#### Configuration

| Property   | Type                   | Default                           | Description                                                           |
| ---------- | ---------------------- | --------------------------------- | --------------------------------------------------------------------- |
| `files`    | `string[]`             | `[]`                              | Files to be scanned, can be an entry into an app or individual files. |
| `reporter` | [`Reporter`][Reporter] | `{ type: 'json', detail: 'raw' }` | Reporter to use for output.                                           |

[Reporter]: ./src/entities/coscan.ts#L4
