import { describe, expect, it } from '@jest/globals';
import { isElementType } from './element.ts';

describe(isElementType, () => {
  it('returns true for an Element type', () => {
    const type = 'Element';

    expect(isElementType(type)).toBe(true);
  });

  it('returns true for a ReactElement type', () => {
    const type = 'ReactElement';

    expect(isElementType(type)).toBe(true);
  });

  it('returns true for a ReactNode type', () => {
    const type = 'ReactNode';

    expect(isElementType(type)).toBe(true);
  });

  it('returns true for a JSX.Element type', () => {
    const type = 'JSX.Element';

    expect(isElementType(type)).toBe(true);
  });

  it('returns true for a React.ForwardRefExoticComponent generic type', () => {
    const type = 'React.ForwardRefExoticComponent<React.RefAttributes<HTMLDivElement>>';

    expect(isElementType(type)).toBe(true);
  });

  it('returns false for non JSX types', () => {
    const type = 'string';

    expect(isElementType(type)).toBe(false);
  });
});
