import { describe, expect, it } from '@jest/globals';
import { factory } from 'typescript';
import { isNullLiteral } from './null-literal.ts';

describe(isNullLiteral, () => {
  it('returns true for null literal', () => {
    const nullLiteral = factory.createNull();

    expect(isNullLiteral(nullLiteral)).toBe(true);
  });

  it('returns false for other nodes', () => {
    const stringLiteral = factory.createStringLiteral('');
    const numericLiteral = factory.createNumericLiteral('0');

    expect(isNullLiteral(stringLiteral)).toBe(false);
    expect(isNullLiteral(numericLiteral)).toBe(false);
  });
});
