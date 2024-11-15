import { describe, expect, it } from '@jest/globals';
import { SyntaxKind } from 'typescript';
import { createTestSourceFile, queryNodeKind } from '../entities/test-utilities.ts';
import { isInitializedFunctionExpression, isInitializedVariable } from './initialized.ts';

describe(isInitializedVariable, () => {
  it('should return true if the variable is initialized', () => {
    const content = 'const hello = "world"';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind(SyntaxKind.VariableDeclaration, sourceFile);

    expect(isInitializedVariable(node)).toBe(true);
  });

  it('should return false if the variable is not initialized', () => {
    const content = 'const hello';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind(SyntaxKind.VariableDeclaration, sourceFile);

    expect(isInitializedVariable(node)).toBe(false);
  });
});

describe(isInitializedFunctionExpression, () => {
  it('should return true if the function expression is initialized', () => {
    const content = 'const hello = function() {}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind(SyntaxKind.VariableDeclaration, sourceFile);

    expect(isInitializedFunctionExpression(node)).toBe(true);
  });

  it('should return false if the function expression is not initialized', () => {
    const content = 'function hello() {}';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind(SyntaxKind.FunctionDeclaration, sourceFile);

    expect(isInitializedFunctionExpression(node)).toBe(false);
  });
});
