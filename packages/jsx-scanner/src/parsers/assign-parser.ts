import {
  type CallExpression,
  isIdentifier,
  isObjectLiteralExpression,
  type Node,
  SignatureKind,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { createComponentDefinition } from '../components/component-definition.ts';
import { getComponentId } from '../components/component-id.ts';
import { type ComponentName } from '../components/component-name.ts';
import { getRelativeFilePath } from '../file-entities/file.ts';
import { getPosition, getPositionPath } from '../file-entities/position.ts';
import type { GivenName } from '../js-entities/declaration.ts';
import type { ImportCollection } from '../js-entities/import.ts';
import { isElementType } from '../jsx-entities/element.ts';
import type { JsxScannerDiscovery } from '../scanner.ts';

function isComponentDefinition(node: Node, typeChecker: TypeChecker) {
  const nodeType = typeChecker.getTypeAtLocation(node);
  const signatures = typeChecker.getSignaturesOfType(nodeType, SignatureKind.Call);

  if (signatures.length) {
    const returnType = typeChecker.getReturnTypeOfSignature(signatures[0]);
    const returnTypeString = typeChecker.typeToString(returnType);

    return isElementType(returnTypeString);
  }

  return false;
}

export const OBJECT_ASSIGN_CALLEES = ['Object.assign', 'assign'] as const;

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

    const definition = createComponentDefinition({
      componentName,
      componentId,
      filePath: relativeFilePath,
      location: positionPath,
      startPosition,
      endPosition,
    });

    discoveries.push(definition);
  });
}
