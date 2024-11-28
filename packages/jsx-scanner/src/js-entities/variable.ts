import { isVariableDeclaration, type Node, type VariableDeclaration } from 'typescript';

export type InitializedVariable = VariableDeclaration & {
  initializer: Required<VariableDeclaration>['initializer'];
};

export function isInitializedVariable(node: Node): node is InitializedVariable {
  return Boolean(isVariableDeclaration(node) && node.initializer);
}
