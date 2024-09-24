import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createSourceFile } from 'typescript';
import { getRelativeFilePath } from './file.ts';

describe(getRelativeFilePath, () => {
  beforeAll(() => {
    process.cwd = jest.fn(() => '/path/to/project');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns the relative file path', () => {
    const sourceFile = createSourceFile('/path/to/project/src/file.ts', 'export const hello = "world"', 1);

    expect(getRelativeFilePath(sourceFile)).toBe('src/file.ts');
  });

  it('returns the file path if it already is a relative path', () => {
    const sourceFile = createSourceFile('src/file.ts', 'export const hello = "world"', 1);

    expect(getRelativeFilePath(sourceFile)).toBe('src/file.ts');
  });
});
