import { describe, expect, it } from '@jest/globals';
import { type ArrowFunction, type FunctionDeclaration, SyntaxKind, type VariableDeclaration } from 'typescript';
import { DefaultValueCollection, findDefaultValueCollection } from './default-value.ts';
import { createTestSourceFile, queryNodeKind } from './test-utilities.ts';

describe(findDefaultValueCollection, () => {
  it('returns a DefaultValues instance', () => {
    const content = 'function example(){}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind<FunctionDeclaration>(SyntaxKind.FunctionDeclaration, sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile });

    expect(defaultValueCollection).toBeInstanceOf(DefaultValueCollection);
  });

  it('finds default values in a function parameter', () => {
    const content = 'function example({ foo = "bar" }){}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind<FunctionDeclaration>(SyntaxKind.FunctionDeclaration, sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node.parameters[0] });

    expect(defaultValueCollection.get('foo')).toBe('"bar"');
  });

  it('finds default values in a function body', () => {
    const content = 'function example(props){ const { foo = "bar" } = props; }';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind<FunctionDeclaration>(SyntaxKind.FunctionDeclaration, sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node.parameters[0] });

    expect(defaultValueCollection.get('foo')).toBe('"bar"');
  });

  it('finds no default values if none are set', () => {
    const content = 'function example(props){}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind<FunctionDeclaration>(SyntaxKind.FunctionDeclaration, sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node.parameters[0] });

    expect(defaultValueCollection.size).toBe(0);
  });

  it('finds no default values if destructured value is different than the parameter of the function', () => {
    const content = 'function example(props){ const other = {}; const { foo = "bar" } = other; }';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind<FunctionDeclaration>(SyntaxKind.FunctionDeclaration, sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node.parameters[0] });

    expect(defaultValueCollection.size).toBe(0);
  });

  it('works with arrow function', () => {
    const content = 'const example = ({ foo = "bar" }) => {};';

    const sourceFile = createTestSourceFile({ content });
    const variable = queryNodeKind<VariableDeclaration>(SyntaxKind.VariableDeclaration, sourceFile);
    const node = variable.initializer as ArrowFunction;

    const defaultValueCollection = findDefaultValueCollection({
      node: node,
      sourceFile,
      parameter: node.parameters[0],
    });

    expect(defaultValueCollection.get('foo')).toBe('"bar"');
  });
});
