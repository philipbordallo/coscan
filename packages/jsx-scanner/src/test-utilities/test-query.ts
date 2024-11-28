import { type FunctionDeclaration, type Node, type SourceFile, SyntaxKind, type VariableDeclaration } from 'typescript';
import { type InitializedFunctionExpression, isInitializedFunctionExpression } from '../js-entities/node.ts';

type SyntaxKindUnion = keyof typeof SyntaxKind;

/**
 * Find all `Node`s of a given kind in a source file.
 */
export function queryAllNodesBy<Kind extends SyntaxKindUnion>(
  kind: Kind,
  sourceFile: SourceFile,
): Array<Node> {
  const foundNodes: Array<Node> = [];

  sourceFile.forEachChild(findAllNodes);

  function findAllNodes(node: Node) {
    if (node.kind === SyntaxKind[kind]) {
      foundNodes.push(node as Node);
    } else {
      node.forEachChild(findAllNodes);
    }
  }

  if (!foundNodes.length) {
    throw new Error(`Nodes of kind ${kind} not found`);
  }

  return foundNodes;
}

/**
 * Find the first `Node` of a given kind in a source file.
 */
export function queryNodeBy<FoundNode extends Node, Kind extends SyntaxKindUnion = SyntaxKindUnion>(
  kind: Kind,
  sourceFile: SourceFile,
): FoundNode {
  let foundNode: FoundNode | undefined = undefined;

  sourceFile.forEachChild(findFirstNode);

  function findFirstNode(node: Node) {
    if (foundNode) {
      return;
    }

    if (node.kind === SyntaxKind[kind]) {
      foundNode = node as FoundNode;
    } else {
      node.forEachChild(findFirstNode);
    }
  }

  if (!foundNode) {
    throw new Error(`Node of kind ${kind} not found`);
  }

  return foundNode as FoundNode;
}

/**
 * Find a `FunctionDeclaration` node in a source file.
 */
export function queryFunctionDeclaration(sourceFile: SourceFile): FunctionDeclaration {
  const node = queryNodeBy<FunctionDeclaration>('FunctionDeclaration', sourceFile) as FunctionDeclaration;

  return node;
}

/**
 * Find a `VariableDeclaration` node in a source file.
 */
export function queryVariableDeclaration(sourceFile: SourceFile): VariableDeclaration {
  const node = queryNodeBy<VariableDeclaration>('VariableDeclaration', sourceFile);

  return node;
}

/**
 * Find a `InitializedFunctionExpression` node in a source file.
 */
export function queryInitializedFunctionExpression(sourceFile: SourceFile): InitializedFunctionExpression {
  const node = queryNodeBy('VariableDeclaration', sourceFile);

  if (!isInitializedFunctionExpression(node) || !node.initializer) {
    throw new Error('Node is not a InitializedFunctionExpression');
  }

  return node;
}
