import {
  type ClassLikeDeclaration,
  type ExpressionWithTypeArguments,
  type Identifier,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { type ComponentDefinition, getComponentId } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';

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
  givenName?: Identifier;
  importCollection: ImportCollection;
  node: ClassLikeDeclaration;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

export function classParser({
  discoveries,
  givenName,
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
