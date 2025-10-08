import { describe, expect, it } from '@coscan/test';
import { getNamespace, trimQuotes } from './string.ts';

describe(getNamespace.name, () => {
  it('returns the namespace when the string has subparts', () => {
    expect(getNamespace('Table.Header')).toBe('Table');
  });

  it('returns undefined when the string does not have subparts', () => {
    expect(getNamespace('Table')).toBeUndefined();
  });
});

describe(trimQuotes.name, () => {
  it('removes single quotes from the beginning and end of a string', () => {
    expect(trimQuotes(`'Table'`)).toBe('Table');
  });

  it('removes double quotes from the beginning and end of a string', () => {
    expect(trimQuotes(`"Table"`)).toBe('Table');
  });

  it('does not remove quotes when the string is not wrapped with quotes', () => {
    expect(trimQuotes('Table')).toBe('Table');
  });
});
