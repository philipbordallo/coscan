import { describe, expect, it } from '@jest/globals';
import { isElementReturn } from './element-return.ts';

describe(isElementReturn, () => {
  it('returns true for JSX with a ReactElement return type', () => {
    const returnType = 'ReactElement';

    expect(isElementReturn(returnType)).toBe(true);
  });

  it('returns true for JSX with a ReactNode return type', () => {
    const returnType = 'ReactNode';

    expect(isElementReturn(returnType)).toBe(true);
  });

  it('returns true for JSX with a JSX.Element return type', () => {
    const returnType = 'JSX.Element';

    expect(isElementReturn(returnType)).toBe(true);
  });

  it('returns true for JSX with a Element return type', () => {
    const returnType = 'Element';

    expect(isElementReturn(returnType)).toBe(true);
  });

  it('returns false for non JSX nodes', () => {
    const returnType = 'string';

    expect(isElementReturn(returnType)).toBe(false);
  });
});
