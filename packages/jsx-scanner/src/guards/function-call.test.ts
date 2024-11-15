import { describe, expect, it } from '@jest/globals';
import { SyntaxKind } from 'typescript';
import { createTestSourceFile, queryNodeKind } from '../entities/test-utilities.ts';
import { isFunctionCall } from './function-call.ts';

describe(isFunctionCall, () => {
  it('should return true if the node is a function call', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind(SyntaxKind.CallExpression, sourceFile);

    expect(isFunctionCall(node, 'React.createElement', sourceFile)).toBe(true);
  });

  it('should return false if the node is not a function call', () => {
    const content = 'React.createElement';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeKind(SyntaxKind.CallExpression, sourceFile);

    expect(isFunctionCall(node, 'React.createElement')).toBe(false);
  });
});
