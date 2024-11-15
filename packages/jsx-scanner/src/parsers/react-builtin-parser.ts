import { type SourceFile, type TypeChecker } from 'typescript';
import { createComponentDefinition, getComponentId } from '../entities/component.ts';
import type { GivenName } from '../entities/declaration.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';
import { isElementType } from '../guards/element.ts';
import type { InitializedVariable } from '../guards/initialized.ts';

export const REACT_BUILTIN_CALLEES = [
  'forwardRef',
  'React.forwardRef',
  'lazy',
  'React.lazy',
  'memo',
  'React.memo',
] as const;

type ReactBuiltinParserArgs = {
  discoveries: JsxScannerDiscovery[];
  givenName: GivenName;
  importCollection: ImportCollection;
  node: InitializedVariable;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

/**
 * Parse React builtins like `React.forwardRef`, `React.lazy`, and `React.memo` as component definitions.
 */
export function reactBuiltinParser({
  discoveries,
  givenName: componentName,
  importCollection,
  node,
  sourceFile,
  typeChecker,
}: ReactBuiltinParserArgs): void {
  const initializerType = typeChecker.getTypeAtLocation(node.initializer);
  const returnType = typeChecker.typeToString(initializerType);

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
