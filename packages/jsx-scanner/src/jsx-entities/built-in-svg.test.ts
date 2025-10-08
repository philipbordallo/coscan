import { describe, expect, it } from '@coscan/test';
import { isBuiltInSvg } from './built-in-svg.ts';

describe(isBuiltInSvg.name, () => {
  it('returns true for built-in SVG elements', () => {
    expect(isBuiltInSvg('svg')).toBe(true);
    expect(isBuiltInSvg('path')).toBe(true);
    expect(isBuiltInSvg('feDisplacementMap')).toBe(true);
  });

  it('returns false for other elements', () => {
    expect(isBuiltInSvg('MyComponent')).toBe(false);
    expect(isBuiltInSvg('div')).toBe(false);
  });
});
