import {
  type ArrowFunction,
  type BindingName,
  type FunctionDeclaration,
  type FunctionExpression,
  type Identifier,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { getComponentId } from '../entities/component.ts';
import type { ComponentDefinition } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';
import { isElementReturn } from '../guards/element-return.ts';

type FunctionNode = FunctionDeclaration | FunctionExpression | ArrowFunction;

function getReturnType(
  node: FunctionNode,
  sourceFile: SourceFile,
  typeChecker: TypeChecker,
): string | undefined {
  const definedReturnType = node.type;

  if (definedReturnType) {
    return definedReturnType.getText(sourceFile);
  }

  const signature = typeChecker.getSignatureFromDeclaration(node);

  if (signature) {
    const inferredReturnType = typeChecker.getReturnTypeOfSignature(signature);

    return typeChecker.typeToString(inferredReturnType);
  }
}

type FunctionParserArgs = {
  node: FunctionNode;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
  givenName?: Identifier | BindingName;
  importCollection: ImportCollection;
  discoveries: JsxScannerDiscovery[];
};

export function functionParser({
  node,
  sourceFile,
  typeChecker,
  givenName,
  importCollection,
  discoveries,
}: FunctionParserArgs) {
  const returnType = getReturnType(node, sourceFile, typeChecker);

  if (!returnType || !isElementReturn(returnType)) return;

  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const componentName = givenName?.getText(sourceFile) ?? '';
  const relativeFilePath = getRelativeFilePath(sourceFile);

  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const definition: ComponentDefinition = {
    type: 'definition',
    componentName,
    componentId,
    filePath: relativeFilePath,
    positionPath: `${relativeFilePath}:${startPosition.line}:${startPosition.character}`,
    startPosition,
    endPosition,
  };

  discoveries.push(definition);
}
