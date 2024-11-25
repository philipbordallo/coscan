import { describe, expect, it } from '@jest/globals';
import { isFunctionDeclaration, isVariableDeclaration } from 'typescript';
import {
  queryAllNodesBy,
  queryFunctionDeclaration,
  queryInitializedFunctionExpression,
  queryNodeBy,
  queryVariableDeclaration,
} from './test-query.ts';
import { createTestSourceFile } from './test-source-file.ts';

describe(queryAllNodesBy, () => {
  it('returns an array of nodes', () => {
    const content = `
      function example() {}

      function example() {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const nodes = queryAllNodesBy('FunctionDeclaration', sourceFile);

    expect(nodes).toHaveLength(2);
  });

  it('throws an error if no nodes are found', () => {
    const content = `
      function example() {}
    `;

    const sourceFile = createTestSourceFile({ content });

    expect(() => queryAllNodesBy('VariableDeclaration', sourceFile)).toThrowError();
  });
});

describe(queryNodeBy, () => {
  it('returns a node', () => {
    const content = `
      function example() {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('FunctionDeclaration', sourceFile);

    expect(node).toBeDefined();
  });

  it('throws an error if no node is found', () => {
    const content = `
      function example() {}
    `;

    const sourceFile = createTestSourceFile({ content });

    expect(() => queryNodeBy('VariableDeclaration', sourceFile)).toThrowError();
  });

  it('only finds the first node of a given type', () => {
    const content = `
      function one() {}

      function two() {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('FunctionDeclaration', sourceFile);

    expect(node.getText(sourceFile)).toBe('function one() {}');
  });
});

describe(queryFunctionDeclaration, () => {
  it('returns a FunctionDeclaration node', () => {
    const content = `
      const test = 'hello';

      function example() {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryFunctionDeclaration(sourceFile);

    expect(isFunctionDeclaration(node)).toBe(true);
  });
});

describe(queryVariableDeclaration, () => {
  it('returns a VariableDeclaration node', () => {
    const content = `
      const test = 'hello';
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryVariableDeclaration(sourceFile);

    expect(isVariableDeclaration(node)).toBe(true);
  });
});

describe(queryInitializedFunctionExpression, () => {
  it('returns a VariableDeclaration node', () => {
    const content = `
      const example = function() {};
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryInitializedFunctionExpression(sourceFile);

    expect(isVariableDeclaration(node)).toBe(true);
  });

  it('throws an error if no node is found', () => {
    const content = `
      const value = 'hello';
    `;

    const sourceFile = createTestSourceFile({ content });

    expect(() => queryInitializedFunctionExpression(sourceFile)).toThrowError();
  });
});
