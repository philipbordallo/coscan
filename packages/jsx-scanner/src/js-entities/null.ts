import { type Node, type NullLiteral, SyntaxKind } from 'typescript';

export function isNullLiteral(node: Node): node is NullLiteral {
  return node.kind === SyntaxKind.NullKeyword;
}
