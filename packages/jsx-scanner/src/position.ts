import { getLineAndCharacterOfPosition, type SourceFile } from 'typescript';
import type { FilePath } from './file.ts';

const ZERO_INDEX_OFFSET = 1;

export type Position = {
  line: number;
  character: number;
};

export function getPosition(position: number, sourceFile: SourceFile): Position {
  const { character, line } = getLineAndCharacterOfPosition(sourceFile, position + ZERO_INDEX_OFFSET);

  return {
    line: line + ZERO_INDEX_OFFSET,
    character: character,
  };
}

export type PositionPath = string;

export function getPositionPath(position: Position, filePath: FilePath): PositionPath {
  return `${filePath}:${position.line}:${position.character}`;
}
