import { describe, expect, it } from '@coscan/test';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { getPosition } from './position.ts';

describe(getPosition.name, () => {
  it('returns the correct position when checking the start', () => {
    const content = 'export const hello = "world"';

    const sourceFile = createTestSourceFile({ content });
    const position = 0;

    const result = getPosition(position, sourceFile);

    expect(result).toEqual({ line: 1, character: position + 1 });
  });

  it('returns the correct position when checking the end', () => {
    const content = 'export const hello = "world"';

    const sourceFile = createTestSourceFile({ content });
    const position = content.length;

    const result = getPosition(position, sourceFile);

    expect(result).toEqual({ line: 1, character: position + 1 });
  });
});
