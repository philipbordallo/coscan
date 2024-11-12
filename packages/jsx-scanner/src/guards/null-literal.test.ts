import { describe, expect, it } from '@jest/globals';
import { SyntaxKind } from 'typescript';
import { createTestSourceFile, queryNodeKind } from '../entities/test-utilities.ts';
import { isNullLiteral } from './null-literal.ts';

describe(isNullLiteral, () => {
  it('returns true for null literal', () => {
    const content = 'const test = null;';

    const sourceFile = createTestSourceFile({ content });
    const nullLiteral = queryNodeKind(SyntaxKind.NullKeyword, sourceFile);

    expect(isNullLiteral(nullLiteral)).toBe(true);
  });

  it('returns false for other nodes', () => {
    const content = 'const options = ["hello", 1];';

    const sourceFile = createTestSourceFile({ content });
    const stringLiteral = queryNodeKind(SyntaxKind.StringLiteral, sourceFile);
    const numericLiteral = queryNodeKind(SyntaxKind.NumericLiteral, sourceFile);

    expect(isNullLiteral(stringLiteral)).toBe(false);
    expect(isNullLiteral(numericLiteral)).toBe(false);
  });
});
