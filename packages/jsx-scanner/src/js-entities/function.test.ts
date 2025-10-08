import { describe, expect, it } from '@coscan/test';
import { queryNodeBy } from '../test-utilities/test-query.ts';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { isFunctionCall, isInitializedFunctionExpression } from './function.ts';

describe(isFunctionCall.name, () => {
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
describe(isInitializedFunctionExpression.name, () => {
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
