import { describe, expect, it } from '@jest/globals';
import { isBuiltInHtml } from './built-in-html.ts';

describe(isBuiltInHtml, () => {
  it('returns true for built-in HTML elements', () => {
    expect(isBuiltInHtml('div')).toBe(true);
    expect(isBuiltInHtml('a')).toBe(true);
    expect(isBuiltInHtml('span')).toBe(true);
  });

  it('returns false for other elements', () => {
    expect(isBuiltInHtml('MyComponent')).toBe(false);
    expect(isBuiltInHtml('svg')).toBe(false);
  });
});
