import path from 'node:path';

export type FilePath = string;
export type Directory = string;

export function getRelativeFilePath(filePath: FilePath): FilePath {
  const currentWorkingDirectory = process.cwd();

  if (filePath.startsWith(currentWorkingDirectory)) {
    return path.relative(currentWorkingDirectory, filePath);
  }

  return filePath;
}
