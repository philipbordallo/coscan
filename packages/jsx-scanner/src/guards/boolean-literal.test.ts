import { describe, expect, it } from '@jest/globals';
import { SyntaxKind } from 'typescript';
import { createTestSourceFile, queryNodeKind } from '../entities/test-utilities.ts';
import { isBooleanLiteral } from './boolean-literal.ts';

describe(isBooleanLiteral, () => {
  it('returns true for true literal', () => {
    const content = 'const test = true;';

    const sourceFile = createTestSourceFile({ content });
    const trueLiteral = queryNodeKind(SyntaxKind.TrueKeyword, sourceFile);

    expect(isBooleanLiteral(trueLiteral)).toBe(true);
  });

  it('returns true for false literal', () => {
    const content = 'const test = false;';

    const sourceFile = createTestSourceFile({ content });
    const falseLiteral = queryNodeKind(SyntaxKind.FalseKeyword, sourceFile);

    expect(isBooleanLiteral(falseLiteral)).toBe(true);
  });

  it('returns false for other nodes', () => {
    const content = 'const test = null;';

    const sourceFile = createTestSourceFile({ content });
    const nullLiteral = queryNodeKind(SyntaxKind.NullKeyword, sourceFile);

    expect(isBooleanLiteral(nullLiteral)).toBe(false);
  });
});
