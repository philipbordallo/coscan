import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createSourceFile, ScriptTarget } from 'typescript';
import { getRelativeFilePath } from './file.ts';

const DEFAULT_OPTIONS = ['export const hello = "world"', ScriptTarget.ESNext] as const;

describe(getRelativeFilePath, () => {
  beforeAll(() => {
    process.cwd = jest.fn(() => '/path/to/project');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns the file path if it already is a relative path', () => {
    const sourceFile = createSourceFile('src/file.ts', ...DEFAULT_OPTIONS);

    expect(getRelativeFilePath(sourceFile.fileName)).toBe('src/file.ts');
  });

  it('returns the relative file path if it matches the current working directory', () => {
    const sourceFile = createSourceFile('/path/to/project/src/file.ts', ...DEFAULT_OPTIONS);

    expect(getRelativeFilePath(sourceFile.fileName)).toBe('src/file.ts');
  });

  it('returns an absolute path if the current working directory does not match the path', () => {
    const sourceFile = createSourceFile('/different/path/src/file.ts', ...DEFAULT_OPTIONS);

    expect(getRelativeFilePath(sourceFile.fileName)).toBe('/different/path/src/file.ts');
  });
});
