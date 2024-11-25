import { describe, expect, it } from '@jest/globals';
import { queryNodeBy } from '../test-utilities/test-query.ts';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { isBooleanLiteral } from './boolean-literal.ts';

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
