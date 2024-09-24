import { describe, expect, it } from '@jest/globals';
import { createSourceFile } from 'typescript';
import { getPosition } from './position.ts';

describe(getPosition, () => {
  const content = 'export const hello = "world"';

  it('returns the correct position when checking the start', () => {
    const sourceFile = createSourceFile('test.ts', content, 1);
    const position = 0;

    const result = getPosition(position, sourceFile);

    expect(result).toEqual({ line: 1, character: position + 1 });
  });

  it('returns the correct position when checking the end', () => {
    const sourceFile = createSourceFile('test.ts', content, 1);
    const position = content.length;

    const result = getPosition(position, sourceFile);

    expect(result).toEqual({ line: 1, character: position + 1 });
  });
});
