import { describe, expect, it } from '@jest/globals';
import { jsxScanner, type JsxScannerDiscovery } from './scanner.ts';

type GroupedDiscoveries = Partial<Record<string, JsxScannerDiscovery[]>>;

function groupByFilePath(discoveries: JsxScannerDiscovery[]): GroupedDiscoveries {
  return Object.groupBy(discoveries, (item) => item.filePath);
}

async function load(discoveries: Promise<GroupedDiscoveries>, filePath: string): Promise<JsxScannerDiscovery[]> {
  const results = await discoveries;
  return results[filePath] ?? [];
}

type Test = {
  it: string;
  filePath: string;
  test: (results: JsxScannerDiscovery[]) => void;
};

const tests: Test[] = [
  {
    it: 'works with a simple button component',
    filePath: 'examples/react-fixtures/src/components/button-component.tsx',
    test: async (results) => {
      expect(results).toHaveLength(2);

      const definition = results[0];
      expect(definition.type).toBe('definition');
      expect(definition.componentName).toBe('ButtonComponent');

      const instance = results[1];
      expect(instance.type).toBe('instance');
      expect(instance.componentName).toBe('button');
    },
  },
  {
    it: 'works with class components',
    filePath: 'examples/react-fixtures/src/components/class-components.tsx',
    test: async (results) => {
      const definitions = results.filter((result) => result.type === 'definition');
      expect(definitions).toHaveLength(3);

      const expressionComponent = definitions[0];
      expect(expressionComponent.componentName).toBe('ClassExpressionComponent');

      const declarationComponent = definitions[1];
      expect(declarationComponent.componentName).toBe('ClassDeclarationComponent');

      const defaultComponent = definitions[2];
      expect(defaultComponent.componentName).toBe('');
    },
  },
  {
    it: 'works with function components',
    filePath: 'examples/react-fixtures/src/components/function-components.tsx',
    test: async (results) => {
      const definitions = results.filter((result) => result.type === 'definition');
      expect(definitions).toHaveLength(4);

      const functionExpressionComponent = definitions[0];
      expect(functionExpressionComponent.componentName).toBe('FunctionExpressionComponent');

      const functionArrowComponent = definitions[1];
      expect(functionArrowComponent.componentName).toBe('FunctionArrowComponent');

      const functionDeclarationComponent = definitions[2];
      expect(functionDeclarationComponent.componentName).toBe('FunctionDeclarationComponent');

      const defaultComponent = definitions[3];
      expect(defaultComponent.componentName).toBe('');
    },
  },
  {
    it: 'works with functions and classes that are not components',
    filePath: 'examples/react-fixtures/src/components/no-component.tsx',
    test: async (results) => {
      expect(results).toHaveLength(0);
    },
  },
  {
    it: 'works with defined return types',
    filePath: 'examples/react-fixtures/src/components/return-type-components.tsx',
    test: async (results) => {
      const definitions = results.filter((result) => result.type === 'definition');
      expect(definitions).toHaveLength(1);

      const component = definitions[0];
      expect(component?.componentName).toBe('ReturnTypeReactElement');
    },
  },
  {
    it: 'works with fragments',
    filePath: 'examples/react-fixtures/src/components/fragment-components.tsx',
    test: async (results) => {
      const instances = results.filter((result) => result.type === 'instance');
      expect(instances).toHaveLength(2);

      const fragmentComponent = instances[0];
      expect(fragmentComponent.componentName).toBe('React.Fragment');

      const reactFragmentComponent = instances[1];
      expect(reactFragmentComponent.componentName).toBe('React.Fragment');
    },
  },
  {
    it: 'handles instance props',
    filePath: 'examples/react-fixtures/src/components/prop-component.tsx',
    test: async (results) => {
      const instances = results.filter((result) => result.type === 'instance');

      expect(instances).toHaveLength(7);

      const stylePropComponent = instances[0];
      expect(stylePropComponent.props).toEqual({
        style: {
          backgroundColor: 'red',
          width: 15,
        },
      });

      const styleShorthandPropComponent = instances[1];
      expect(styleShorthandPropComponent.props).toEqual({
        style: {
          color: 'Expression -> color',
        },
      });

      const expressionPropComponent = instances[2];
      expect(expressionPropComponent.props).toEqual({
        onClick: 'Expression -> handleClick',
      });

      const booleanPropComponent = instances[3];
      expect(booleanPropComponent.props).toEqual({
        hidden: true,
        'aria-disabled': false,
        'aria-checked': true,
      });

      const stringPropComponent = instances[4];
      expect(stringPropComponent.props).toEqual({
        id: 'example-id',
      });

      const nullComponent = instances[5];
      expect(nullComponent.props).toEqual({
        'data-attribute': null,
      });

      const numberPropComponent = instances[6];
      expect(numberPropComponent.props).toEqual({
        tabIndex: '2',
      });
    },
  },
  {
    it: 'works with imported components',
    filePath: 'examples/react-fixtures/src/components/import-component.tsx',
    test: async (results) => {
      const instances = results.filter((result) => result.type === 'instance');
      expect(instances).toHaveLength(1);

      const importComponent = instances[0];
      expect(importComponent.componentName).toBe('Button');
    },
  },
];

describe(jsxScanner, () => {
  const discoveries = jsxScanner({
    files: tests.map(({ filePath }) => filePath),
  }).then(groupByFilePath);

  it.each(tests)('$it', async ({ filePath, test }) => {
    const results = await load(discoveries, filePath);

    test(results);
  });
});
