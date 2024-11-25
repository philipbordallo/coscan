import { createSourceFile, ScriptTarget, type SourceFile } from 'typescript';

type CreateTestSourceFileOptions = {
  content: string;
  fileName?: string;
  target?: ScriptTarget;
};

/**
 * Create a test source file with content and given file name.
 */
export function createTestSourceFile({
  content,
  fileName = 'test.ts',
}: CreateTestSourceFileOptions): SourceFile {
  return createSourceFile(fileName, content, ScriptTarget.ESNext);
}
