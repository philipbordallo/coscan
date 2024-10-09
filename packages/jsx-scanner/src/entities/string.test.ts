import { describe, expect, it } from '@jest/globals';
import { getNamespace } from './string.ts';

describe(getNamespace, () => {
  it('returns the namespace when the string has subparts', () => {
    expect(getNamespace('Table.Header')).toBe('Table');
  });

  it('returns undefined when the string does not have subparts', () => {
    expect(getNamespace('Table')).toBeUndefined();
  });
});
