# [`coscan`](https://www.npmjs.com/package/coscan)

> Node.js API implementation of coscan.

## Installation

```sh
npm add -D coscan
```

## Usage

```js
import { coscan } from 'coscan';

coscan({
  files: ['src/app.tsx'],
});
```

## Configuration

| Name       | Type                   | Default                           | Description                                                           |
| ---------- | ---------------------- | --------------------------------- | --------------------------------------------------------------------- |
| `files`    | `string[]`             | `[]`                              | Files to be scanned, can be an entry into an app or individual files. |
| `reporter` | [`Reporter`][Reporter] | `{ type: 'json', detail: 'raw' }` | Reporter to use for output.                                           |

[Reporter]: ./src/entities/coscan.ts#L4
