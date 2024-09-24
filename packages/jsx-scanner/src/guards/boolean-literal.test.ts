import { describe, expect, it } from '@jest/globals';
import { factory } from 'typescript';
import { isBooleanLiteral } from './boolean-literal.ts';

describe(isBooleanLiteral, () => {
  it('returns true for true literal', () => {
    const trueLiteral = factory.createTrue();
    expect(isBooleanLiteral(trueLiteral)).toBe(true);
  });

  it('returns true for false literal', () => {
    const falseLiteral = factory.createFalse();
    expect(isBooleanLiteral(falseLiteral)).toBe(true);
  });

  it('returns false for other nodes', () => {
    const nullLiteral = factory.createNull();
    expect(isBooleanLiteral(nullLiteral)).toBe(false);
  });
});
