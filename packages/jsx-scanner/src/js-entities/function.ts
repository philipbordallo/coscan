import {
  type ArrowFunction,
  type CallExpression,
  type FunctionExpression,
  isArrowFunction,
  isCallExpression,
  isFunctionExpression,
  type Node,
  type SourceFile,
  type VariableDeclaration,
} from 'typescript';
import { isInitializedVariable } from './variable.ts';

export function isFunctionCall(
  node: Node,
  name: string | readonly string[],
  sourceFile?: SourceFile,
): node is CallExpression {
  const callee = isCallExpression(node) && node.expression.getText(sourceFile);

  return !!callee && name.includes(callee);
}
export type InitializedFunctionExpression = VariableDeclaration & {
  initializer: FunctionExpression | ArrowFunction;
};

export function isInitializedFunctionExpression(node: Node): node is InitializedFunctionExpression {
  return isInitializedVariable(node) && (isFunctionExpression(node.initializer) || isArrowFunction(node.initializer));
}
