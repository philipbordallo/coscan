import { type CallExpression, isCallExpression, type Node, type SourceFile } from 'typescript';

export function isFunctionCall(
  node: Node,
  name: string | readonly string[],
  sourceFile?: SourceFile,
): node is CallExpression {
  const callee = isCallExpression(node) && node.expression.getText(sourceFile);

  return !!callee && name.includes(callee);
}
