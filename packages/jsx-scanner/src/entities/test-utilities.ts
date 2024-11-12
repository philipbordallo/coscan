import { createSourceFile, type Node, ScriptTarget, type SourceFile, SyntaxKind } from 'typescript';

type CreateTestSourceFileOptions = {
  content?: string;
  fileName?: string;
};

/**
 * Create a test source file with content and given file name.
 */
export function createTestSourceFile({
  content = 'const test = "hello world";',
  fileName = 'test.ts',
}: CreateTestSourceFileOptions): SourceFile {
  return createSourceFile(fileName, content, ScriptTarget.ESNext);
}

/**
 * Find a node of a given kind in a source file.
 */
export function queryNodeKind(kind: SyntaxKind, sourceFile: SourceFile): Node {
  let node = {
    kind: SyntaxKind.Unknown,
    getText: () => '',
  } as Node;

  function findNode(foundNode: Node) {
    if (foundNode.kind === kind) {
      node = foundNode;
    } else {
      foundNode.forEachChild(findNode);
    }
  }

  sourceFile.forEachChild(findNode);

  return node;
}
