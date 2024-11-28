import {
  type ArrowFunction,
  type BooleanLiteral,
  type CallExpression,
  type FunctionExpression,
  isArrowFunction,
  isCallExpression,
  isFunctionExpression,
  isVariableDeclaration,
  type Node,
  type NullLiteral,
  type SourceFile,
  SyntaxKind,
  type VariableDeclaration,
} from 'typescript';

export function isBooleanLiteral(node: Node): node is BooleanLiteral {
  return node.kind === SyntaxKind.TrueKeyword || node.kind === SyntaxKind.FalseKeyword;
}

export function isFunctionCall(
  node: Node,
  name: string | readonly string[],
  sourceFile?: SourceFile,
): node is CallExpression {
  const callee = isCallExpression(node) && node.expression.getText(sourceFile);

  return !!callee && name.includes(callee);
}

export type InitializedVariable = VariableDeclaration & {
  initializer: Required<VariableDeclaration>['initializer'];
};

export function isInitializedVariable(node: Node): node is InitializedVariable {
  return Boolean(isVariableDeclaration(node) && node.initializer);
}

export type InitializedFunctionExpression = VariableDeclaration & {
  initializer: FunctionExpression | ArrowFunction;
};

export function isInitializedFunctionExpression(node: Node): node is InitializedFunctionExpression {
  return isInitializedVariable(node) && (isFunctionExpression(node.initializer) || isArrowFunction(node.initializer));
}

export function isNullLiteral(node: Node): node is NullLiteral {
  return node.kind === SyntaxKind.NullKeyword;
}
