import { describe, expect, it } from '@coscan/test';
import { queryNodeBy } from '../test-utilities/test-query.ts';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { isNullLiteral } from './null.ts';

describe(isNullLiteral.name, () => {
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
