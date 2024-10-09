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
import { getPosition, getPositionPath } from '../entities/position.ts';
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
  discoveries: JsxScannerDiscovery[];
  givenName?: Identifier | BindingName;
  importCollection: ImportCollection;
  node: FunctionNode;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

export function functionParser({
  discoveries,
  givenName,
  importCollection,
  node,
  sourceFile,
  typeChecker,
}: FunctionParserArgs) {
  const returnType = getReturnType(node, sourceFile, typeChecker);

  if (!isElementReturn(returnType)) return;

  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const relativeFilePath = getRelativeFilePath(sourceFile.fileName);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

  const componentName = givenName?.getText(sourceFile) ?? '';
  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const definition: ComponentDefinition = {
    type: 'definition',
    componentName,
    componentId,
    filePath: relativeFilePath,
    location: positionPath,
    startPosition,
    endPosition,
  };

  discoveries.push(definition);
}
