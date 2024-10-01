import { describe, expect, it, jest } from '@jest/globals';
import {
  type CompilerOptions,
  createCompilerHost,
  createModuleResolutionCache,
  createProgram,
  createSourceFile,
  JsxEmit,
  ScriptKind,
  ScriptTarget,
} from 'typescript';
import type { ImportCollection } from '../entities/import.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';
import { parser, type ParserArgs } from './parser.ts';

jest.mock('../entities/unique-id.ts', () => ({
  createUniqueId() {
    return 1;
  },
}));

type Config = Pick<ParserArgs, 'compilerOptions' | 'moduleResolutionCache' | 'typeChecker'>;

function setupConfig(): Config {
  const compilerOptions: CompilerOptions = {
    jsx: JsxEmit.React,
    checkJs: true,
    rootDir: './',
  };

  const host = createCompilerHost(compilerOptions);

  const program = createProgram(
    ['./test.tsx'],
    compilerOptions,
    host,
  );

  const moduleResolutionCache = createModuleResolutionCache(
    program.getCurrentDirectory(),
    host.getCanonicalFileName,
    compilerOptions,
  );
  const typeChecker = program.getTypeChecker();

  return {
    compilerOptions,
    moduleResolutionCache,
    typeChecker,
  };
}

function render(config: Config): (content: string) => ParserArgs {
  return (content) => {
    const sourceFile = createSourceFile(
      './test.tsx',
      content,
      ScriptTarget.ESNext,
      true,
      ScriptKind.TSX,
    );

    const discoveries: JsxScannerDiscovery[] = [];

    const importCollection: ImportCollection = new Map();

    return {
      ...config,
      sourceFile,
      discoveries,
      importCollection,
    };
  };
}

describe(parser, () => {
  const config = setupConfig();
  const renderWithConfig = render(config);

  it('parses a simple JSX element', () => {
    const output = renderWithConfig(`
      import React from 'react';
      function App() {
        return <div>Hello, world!</div>;
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
    expect(output.discoveries[0]).toEqual({
      type: 'definition',
      componentId: 'jsx:1',
      componentName: 'App',
      filePath: 'test.tsx',
      location: 'test.tsx:3:7',
      startPosition: { line: 3, character: 7 },
      endPosition: { line: 6, character: 0 },
    });
    expect(output.discoveries[1]).toEqual({
      type: 'instance',
      componentId: 'html:1',
      componentName: 'div',
      filePath: 'test.tsx',
      location: 'test.tsx:4:16',
      startPosition: { line: 4, character: 16 },
      endPosition: { line: 4, character: 40 },
      props: {},
      isSelfClosing: false,
    });
  });

  it('handles a self-closing JSX element', () => {
    const output = renderWithConfig(`
      import React from 'react';
      function App() {
        return <img src="image.png" />;
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
    expect(output.discoveries[1]).toEqual({
      type: 'instance',
      componentId: 'html:1',
      componentName: 'img',
      filePath: 'test.tsx',
      location: 'test.tsx:4:16',
      startPosition: { line: 4, character: 16 },
      endPosition: { line: 4, character: 39 },
      props: { src: 'image.png' },
      isSelfClosing: true,
    });
  });

  it('works with a component defined with an arrow function', () => {
    const output = renderWithConfig(`
      import React from 'react';
      const App = () => <div>Hello, world!</div>;
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
    expect(output.discoveries[0].type).toBe('definition');
  });

  it('works with a component defined with a function expression', () => {
    const output = renderWithConfig(`
      import React from 'react';
      const value = Hello, world!;
      const App = function() {
        return <div>{value}</div>;
      };
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
    expect(output.discoveries[0].type).toBe('definition');
  });

  it('works with a component with a defined return type', () => {
    const output = renderWithConfig(`
      import React from 'react';
      function App(): JSX.Element {
        return <div>Hello, world!</div>;
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
    expect(output.discoveries[0].type).toBe('definition');
  });

  it('works with other function declarations that are not components', () => {
    const output = renderWithConfig(`
      import React from 'react';
      function add(a: number, b: number): number {
        return a + b;
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(0);
  });

  it('works with fragments', () => {
    const output = renderWithConfig(`
      import React, { Fragment } from 'react';
      function App() {
        return <>Hello</>;
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
  });

  it('works with unresolved imports', () => {
    const output = renderWithConfig(`
      import React from './blah.ts';
      function App() {
        return <div>Hello, world!</div>;
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
  });

  it('work with props', () => {
    const output = renderWithConfig(`
      import React from 'react';
      function App() {
        const color = 'red';

        const handleClick = () => {
          console.log('Clicked!');
        };

        return (
          <div style={{ color, display: 'flex' }} data-attribute={null}>
            <button onClick={handleClick} id="click-me" tabIndex={2} disabled autoFocus={false}>Click me!</button>
          </div>
        );
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    const instances = output.discoveries.filter(
      (discovery) => discovery.type === 'instance',
    );

    expect(instances[0].props).toEqual({
      'data-attribute': null,
      style: {
        color: 'Expression -> color',
        display: 'flex',
      },
    });

    expect(instances[1].props).toEqual({
      autoFocus: false,
      id: 'click-me',
      tabIndex: '2',
      onClick: 'Expression -> handleClick',
      disabled: true,
    });
  });

  it('works with class components', () => {
    const output = renderWithConfig(`
      import React from 'react';
      class App extends React.Component {
        render() {
          return <div>Hello, world!</div>;
        }
      }
    `);

    const parse = parser(output);
    parse(output.sourceFile);

    expect(output.discoveries).toHaveLength(2);
  });
});
