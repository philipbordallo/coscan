import { describe, expect, it } from '@jest/globals';
import { isArrowFunction } from 'typescript';
import { DefaultValueCollection, findDefaultValueCollection } from './default-value.ts';
import {
  queryFunctionDeclaration,
  queryInitializedFunctionExpression,
  queryNodeBy,
} from './test-utilities/test-query.ts';
import { createTestSourceFile } from './test-utilities/test-source-file.ts';

describe(findDefaultValueCollection, () => {
  it('returns a DefaultValues instance', () => {
    const content = `
      function example() {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryFunctionDeclaration(sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile });

    expect(defaultValueCollection).toBeInstanceOf(DefaultValueCollection);
  });

  it('finds default values in a function parameter', () => {
    const content = `
      function example({ foo = "bar" }) {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryFunctionDeclaration(sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node?.parameters[0] });

    expect(defaultValueCollection.get('foo')).toBe('"bar"');
  });

  it('finds default values in a function body', () => {
    const content = `
      function example(props){ 
        const { foo = "bar" } = props; 
      }
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryFunctionDeclaration(sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node?.parameters[0] });

    expect(defaultValueCollection.get('foo')).toBe('"bar"');
  });

  it('finds no default values if none are set', () => {
    const content = `
      function example(props) {}
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryFunctionDeclaration(sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node?.parameters[0] });

    expect(defaultValueCollection.size).toBe(0);
  });

  it('finds no default values if destructured value is different than the parameter of the function', () => {
    const content = `
      function example(props) { 
        const other = {}; 
        const { foo = "bar" } = other; 
      }
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryFunctionDeclaration(sourceFile);

    const defaultValueCollection = findDefaultValueCollection({ node, sourceFile, parameter: node?.parameters[0] });

    expect(defaultValueCollection.size).toBe(0);
  });

  it('works with an arrow function', () => {
    const content = `
      const example = ({ foo = "bar" }) => {};
    `;

    const sourceFile = createTestSourceFile({ content });
    const node = queryInitializedFunctionExpression(sourceFile);

    const defaultValueCollection = findDefaultValueCollection({
      node: node.initializer,
      sourceFile,
      parameter: node.initializer.parameters[0],
    });

    expect(defaultValueCollection.get('foo')).toBe('"bar"');
  });
});
