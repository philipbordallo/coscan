import { type BooleanLiteral, type Node, SyntaxKind } from 'typescript';

export function isBooleanLiteral(node: Node): node is BooleanLiteral {
  return node.kind === SyntaxKind.TrueKeyword || node.kind === SyntaxKind.FalseKeyword;
}
