import {
  type ArrowFunction,
  type FunctionExpression,
  isArrowFunction,
  isFunctionExpression,
  isVariableDeclaration,
  type Node,
  type VariableDeclaration,
} from 'typescript';

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
