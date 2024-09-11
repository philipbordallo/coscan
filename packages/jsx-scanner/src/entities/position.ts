import { getLineAndCharacterOfPosition, type SourceFile } from 'typescript';

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
