import type { SourceFile } from 'typescript';

export type FilePath = string;

export function getRelativeFilePath(sourceFile: SourceFile): FilePath {
  const currentWorkingDirectory = process.cwd();

  const relativeFilePath = sourceFile.fileName.startsWith(currentWorkingDirectory)
    ? sourceFile.fileName.replace(currentWorkingDirectory + '/', '')
    : sourceFile.fileName;

  return relativeFilePath;
}
