import { describe, expect, it } from '@jest/globals';
import {
  isBooleanLiteral,
  isFunctionCall,
  isInitializedFunctionExpression,
  isInitializedVariable,
  isNullLiteral,
} from './node.ts';
import { queryNodeBy } from './test-utilities/test-query.ts';
import { createTestSourceFile } from './test-utilities/test-source-file.ts';

describe(isBooleanLiteral, () => {
  it('returns true for true literal', () => {
    const content = 'const test = true;';

    const sourceFile = createTestSourceFile({ content });
    const trueLiteral = queryNodeBy('TrueKeyword', sourceFile);

    expect(isBooleanLiteral(trueLiteral)).toBe(true);
  });

  it('returns true for false literal', () => {
    const content = 'const test = false;';

    const sourceFile = createTestSourceFile({ content });
    const falseLiteral = queryNodeBy('FalseKeyword', sourceFile);

    expect(isBooleanLiteral(falseLiteral)).toBe(true);
  });

  it('returns false for other nodes', () => {
    const content = 'const test = null;';

    const sourceFile = createTestSourceFile({ content });
    const nullLiteral = queryNodeBy('NullKeyword', sourceFile);

    expect(isBooleanLiteral(nullLiteral)).toBe(false);
  });
});

describe(isFunctionCall, () => {
  it('should return true if the node is a function call', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, 'React.createElement', sourceFile)).toBe(true);
  });

  it('should return true if the node is a function call and the name matches one of the array given', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, ['React.createElement'], sourceFile)).toBe(true);
  });

  it('should return false if the node is not a function call', () => {
    const content = 'React.createElement';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('PropertyAccessExpression', sourceFile);

    expect(isFunctionCall(node, 'React.createElement')).toBe(false);
  });

  it('should return false if the node is a function call but the name does not match', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, 'React.create', sourceFile)).toBe(false);
  });

  it('should return false if the node is a function call but the name does not match the array given', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, ['React.create'], sourceFile)).toBe(false);
  });
});

describe(isInitializedVariable, () => {
  it('should return true if the variable is initialized', () => {
    const content = 'const hello = "world"';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('VariableDeclaration', sourceFile);

    expect(isInitializedVariable(node)).toBe(true);
  });

  it('should return false if the variable is not initialized', () => {
    const content = 'const hello';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('VariableDeclaration', sourceFile);

    expect(isInitializedVariable(node)).toBe(false);
  });
});

describe(isInitializedFunctionExpression, () => {
  it('should return true if the function expression is initialized', () => {
    const content = 'const hello = function() {}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('VariableDeclaration', sourceFile);

    expect(isInitializedFunctionExpression(node)).toBe(true);
  });

  it('should return false if the function expression is not initialized', () => {
    const content = 'function hello() {}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('FunctionDeclaration', sourceFile);

    expect(isInitializedFunctionExpression(node)).toBe(false);
  });
});

describe(isNullLiteral, () => {
  it('returns true for null literal', () => {
    const content = 'const test = null;';

    const sourceFile = createTestSourceFile({ content });
    const nullLiteral = queryNodeBy('NullKeyword', sourceFile);

    expect(isNullLiteral(nullLiteral)).toBe(true);
  });

  it('returns false for other nodes', () => {
    const content = 'const options = ["hello", 1];';

    const sourceFile = createTestSourceFile({ content });
    const stringLiteral = queryNodeBy('StringLiteral', sourceFile);
    const numericLiteral = queryNodeBy('NumericLiteral', sourceFile);

    expect(isNullLiteral(stringLiteral)).toBe(false);
    expect(isNullLiteral(numericLiteral)).toBe(false);
  });
});
