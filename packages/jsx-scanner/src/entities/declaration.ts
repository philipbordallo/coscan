import {
  type ClassLikeDeclaration,
  type FunctionDeclaration,
  isClassExpression,
  isVariableDeclaration,
  type SourceFile,
  SyntaxKind,
  type VariableDeclaration,
} from 'typescript';

export type GivenName = string;

/**
 * Get the given name of a declaration.
 */
export function getGivenName(
  node: FunctionDeclaration | VariableDeclaration | ClassLikeDeclaration,
  sourceFile: SourceFile,
): GivenName {
  const modifiers = !isVariableDeclaration(node) ? node.modifiers : undefined;
  const isDefaultExport = modifiers?.some((modifier) => modifier.kind === SyntaxKind.DefaultKeyword);

  // If node is a class expression, get parent node to determine given name
  const name = isClassExpression(node) && isVariableDeclaration(node.parent)
    ? node.parent.name
    : node.name;

  if (isDefaultExport) {
    return 'default';
  }

  // If there is no defined name then fallback to an empty string
  return name?.getText(sourceFile) ?? '';
}
