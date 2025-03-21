# coscan

> A component scanner for React.

> [!NOTE]
> This project is in early development and the API will potentially change.

## Use cases

- Track a design system's usage across a codebase
- Identify where components are breaking out of design system constraints with props like `className` or `style`

## Getting Started

Check out the [coscan package documentation][coscan] for more information.

### Packages

| Name                                     | Description                          |
| ---------------------------------------- | ------------------------------------ |
| [`coscan`][coscan]                       | Main package for CLI and Node.js API |
| [`@coscan/json-reporter`][json-reporter] | JSON reporter                        |
| [`@coscan/jsx-scanner`][jsx-scanner]     | JSX scanner                          |

### Examples

| Name                                       | Description              |
| ------------------------------------------ | ------------------------ |
| [`@coscan/react-fixtures`][react-fixtures] | Simple example for React |

[coscan]: ./packages/coscan/README.md
[json-reporter]: ./packages/json-reporter/README.md
[jsx-scanner]: ./packages/jsx-scanner/README.md
[react-fixtures]: ./examples/react-fixtures/README.md
