import {
  type BindingName,
  type CallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  type Node,
  SignatureKind,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { type ComponentDefinition, type ComponentName, getComponentId } from '../entities/component.ts';
import type { GivenName } from '../entities/declaration.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';
import { isElementReturn } from '../guards/element-return.ts';

function isComponentDefinition(node: Node, typeChecker: TypeChecker) {
  const nodeType = typeChecker.getTypeAtLocation(node);
  const signatures = typeChecker.getSignaturesOfType(nodeType, SignatureKind.Call);

  if (signatures.length) {
    const returnType = typeChecker.getReturnTypeOfSignature(signatures[0]);
    const returnTypeString = typeChecker.typeToString(returnType);

    return isElementReturn(returnTypeString);
  }

  return false;
}

type AssignParserArgs = {
  discoveries: JsxScannerDiscovery[];
  givenName: GivenName;
  importCollection: ImportCollection;
  node: CallExpression;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

export function assignParser({
  discoveries,
  givenName: namespace,
  importCollection,
  node,
  sourceFile,
  typeChecker,
}: AssignParserArgs) {
  // If node expressions is not `Object.assign`, skip
  const expression = node.expression.getText(sourceFile);
  if (expression !== 'Object.assign') return;

  const parts: Record<string, Node> = {};

  node.arguments.forEach((argument) => {
    // If argument is the parent component, example `Table`
    if (isIdentifier(argument)) {
      if (isComponentDefinition(argument, typeChecker)) {
        parts[namespace] = argument;
      }
    }

    // If property is a sub component, example `Table.Row`
    if (isObjectLiteralExpression(argument)) {
      argument.properties.forEach((property) => {
        const subName = `${namespace}.${property.getText()}`;

        if (isComponentDefinition(property, typeChecker)) {
          parts[subName] = property;
        }
      });
    }
  });

  Object.entries(parts).forEach(([partName, partNode]) => {
    const startPosition = getPosition(partNode.getStart(sourceFile), sourceFile);
    const endPosition = getPosition(partNode.getEnd(), sourceFile);

    const relativeFilePath = getRelativeFilePath(sourceFile.fileName);
    const positionPath = getPositionPath(startPosition, relativeFilePath);

    const componentName: ComponentName = partName;
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
  });
}
