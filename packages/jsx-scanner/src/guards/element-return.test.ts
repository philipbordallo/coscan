import { describe, expect, it } from '@jest/globals';
import { factory, isJsxElement } from 'typescript';
import { isElementReturn } from './element-return.ts';

describe(isElementReturn, () => {
  it('returns true for JSX element', () => {
    const attributes = factory.createJsxAttributes([]);
    const openingElement = factory.createJsxOpeningElement(factory.createIdentifier('div'), undefined, attributes);
    const closingElement = factory.createJsxClosingElement(factory.createIdentifier('div'));
    const jsxElement = factory.createJsxElement(openingElement, [], closingElement);

    expect(isJsxElement(jsxElement)).toBe(true);
  });
});
