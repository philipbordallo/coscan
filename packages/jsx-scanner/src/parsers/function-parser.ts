import {
  type ArrowFunction,
  type FunctionDeclaration,
  type FunctionExpression,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { createComponentDefinition, getComponentId } from '../component.ts';
import { getRelativeFilePath } from '../file-entities/file.ts';
import { getPosition, getPositionPath } from '../file-entities/position.ts';
import type { GivenName } from '../js-entities/declaration.ts';
import type { ImportCollection } from '../js-entities/import.ts';
import { isElementType } from '../jsx-entities/element.ts';
import type { JsxScannerDiscovery } from '../scanner.ts';

export type FunctionNode = FunctionDeclaration | FunctionExpression | ArrowFunction;

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
  discoveries: JsxScannerDiscovery[];
  givenName: GivenName;
  importCollection: ImportCollection;
  node: FunctionNode;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

export function functionParser({
  discoveries,
  givenName: componentName,
  importCollection,
  node,
  sourceFile,
  typeChecker,
}: FunctionParserArgs) {
  const returnType = getReturnType(node, sourceFile, typeChecker);

  if (!isElementType(returnType)) return;

  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const relativeFilePath = getRelativeFilePath(sourceFile.fileName);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const definition = createComponentDefinition({
    componentName,
    componentId,
    filePath: relativeFilePath,
    location: positionPath,
    startPosition,
    endPosition,
  });

  discoveries.push(definition);
}
