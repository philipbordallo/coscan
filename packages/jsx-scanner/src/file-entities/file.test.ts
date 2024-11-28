import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { getRelativeFilePath } from './file.ts';

describe(getRelativeFilePath, () => {
  const content = 'const hello = "world";';

  beforeAll(() => {
    process.cwd = jest.fn(() => '/path/to/project');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns the file path if it already is a relative path', () => {
    const sourceFile = createTestSourceFile({ content, fileName: 'src/file.ts' });

    expect(getRelativeFilePath(sourceFile.fileName)).toBe('src/file.ts');
  });

  it('returns the relative file path if it matches the current working directory', () => {
    const sourceFile = createTestSourceFile({ content, fileName: '/path/to/project/src/file.ts' });

    expect(getRelativeFilePath(sourceFile.fileName)).toBe('src/file.ts');
  });

  it('returns an absolute path if the current working directory does not match the path', () => {
    const sourceFile = createTestSourceFile({ content, fileName: '/different/path/src/file.ts' });

    expect(getRelativeFilePath(sourceFile.fileName)).toBe('/different/path/src/file.ts');
  });
});
