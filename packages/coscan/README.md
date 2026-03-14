# `coscan`

> A component scanner with CLI and Node.js API implementations.

[**`npm`**][npm-link]

## Installation

```sh
npm add -D coscan
```

## Usage

This package can be used via CLI or as a Node.js API.

### CLI

```sh
npx coscan <files...> [options]
```

#### Example

```sh
npx coscan src/app.tsx --output results.json
```

#### Configuration

| Argument     | Type       | Description                                                           |
| ------------ | ---------- | --------------------------------------------------------------------- |
| `<files...>` | `string[]` | Files to be scanned, can be an entry into an app or individual files. |
| `[options]`  |            | See options table below.                                              |

| Option            | Type                    | Description                 |
| ----------------- | ----------------------- | --------------------------- |
| `--output` `-o`   | `string`                | File to output results to.  |
| `--reporter` `-r` | `json:raw` `json:count` | Reporter to use for output. |

### Node.js API

#### Example

```js
import { coscan } from 'coscan';

const results = coscan({
  files: ['src/app.tsx'],
});
```

#### Configuration

| Property   | Type                   | Default                           | Description                                                           |
| ---------- | ---------------------- | --------------------------------- | --------------------------------------------------------------------- |
| `files`    | `string[]`             | `[]`                              | Files to be scanned, can be an entry into an app or individual files. |
| `reporter` | [`Reporter`][Reporter] | `{ type: 'json', detail: 'raw' }` | Reporter to use for output.                                           |

[Reporter]: ./src/coscan.ts#L4
[npm-link]: https://www.npmjs.com/package/coscan
