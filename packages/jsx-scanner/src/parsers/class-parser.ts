import {
  type ClassLikeDeclaration,
  type HeritageClause,
  type Identifier,
  type NodeArray,
  type SourceFile,
} from 'typescript';
import { type ComponentDefinition, getComponentId } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';

const REACT_BASE_CLASSES = ['React.Component', 'React.PureComponent', 'Component', 'PureComponent'];

function isReactComponentDescendant(heritageClauses: NodeArray<HeritageClause>, sourceFile?: SourceFile): boolean {
  const heritageExpressions = heritageClauses.flatMap((clause) =>
    clause.types.map((type) => type.expression.getText(sourceFile))
  );

  return heritageExpressions.some((expression) => REACT_BASE_CLASSES.includes(expression));
}

type ClassParserArgs = {
  discoveries: JsxScannerDiscovery[];
  givenName?: Identifier;
  importCollection: ImportCollection;
  node: ClassLikeDeclaration;
  sourceFile: SourceFile;
};

export function classParser({
  discoveries,
  givenName,
  importCollection,
  node,
  sourceFile,
}: ClassParserArgs) {
  // Ignore classes that don't have a lineage or aren't descendants of React.Component or React.PureComponent
  if (!node.heritageClauses || !isReactComponentDescendant(node.heritageClauses, sourceFile)) {
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
