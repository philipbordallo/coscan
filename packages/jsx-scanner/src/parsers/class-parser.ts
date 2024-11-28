import {
  type ClassLikeDeclaration,
  type ExpressionWithTypeArguments,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { createComponentDefinition, getComponentId } from '../component.ts';
import { getRelativeFilePath } from '../file-entities/file.ts';
import { getPosition, getPositionPath } from '../file-entities/position.ts';
import type { GivenName } from '../js-entities/declaration.ts';
import type { ImportCollection } from '../js-entities/import.ts';
import type { JsxScannerDiscovery } from '../scanner.ts';

const REACT_BASE_CLASSES = ['Component', 'PureComponent'];

function getClassType(
  expressions: ExpressionWithTypeArguments[],
  typeChecker: TypeChecker,
): string {
  const baseTypes = expressions?.map((expression) => typeChecker.getTypeAtLocation(expression));
  const name = baseTypes?.map((type) => type.getSymbol()?.getName()).join('');

  return name;
}

type ClassParserArgs = {
  discoveries: JsxScannerDiscovery[];
  givenName: GivenName;
  importCollection: ImportCollection;
  node: ClassLikeDeclaration;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

export function classParser({
  discoveries,
  givenName: componentName,
  importCollection,
  node,
  sourceFile,
  typeChecker,
}: ClassParserArgs) {
  // If class does not extend any base classes, skip
  if (!node.heritageClauses) {
    return;
  }

  const expressionsWithTypeArguments = node.heritageClauses.flatMap((clause) => clause.types);
  const classType = getClassType(expressionsWithTypeArguments, typeChecker);

  // If class is not a React component, skip
  if (!REACT_BASE_CLASSES.includes(classType)) {
    return;
  }

  const startPosition = getPosition(node.getStart(), sourceFile);
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
