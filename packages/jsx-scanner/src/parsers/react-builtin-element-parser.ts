import { type CallExpression, isObjectLiteralExpression, type SourceFile, type TypeChecker } from 'typescript';
import { createComponentInstance, getComponentId } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import { parseExpressionToObjectPropValue } from '../entities/prop.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';
import { getNamespace, trimQuotes } from '../entities/string.ts';

export const REACT_BUILTIN_ELEMENT_CALLEES = ['React.createElement', 'createElement'] as const;

type ReactBuiltinElementParserArgs = {
  discoveries: JsxScannerDiscovery[];
  importCollection: ImportCollection;
  node: CallExpression;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
};

/**
 * Parse React builtins like `React.createElement` as component instances.
 */
export function reactBuiltinElementParser({
  discoveries,
  node,
  sourceFile,
  importCollection,
}: ReactBuiltinElementParserArgs): void {
  const [name, props, children] = node.arguments;

  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const relativeFilePath = getRelativeFilePath(sourceFile.fileName);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

  const componentName = trimQuotes(name.getText(sourceFile));
  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const importKey = getNamespace(componentName) ?? componentName;
  const importMeta = importCollection.get(importKey);

  const instance = createComponentInstance({
    componentId,
    componentName,
    props: isObjectLiteralExpression(props) ? parseExpressionToObjectPropValue(props, sourceFile) : {},
    importedFrom: importMeta?.path,
    location: positionPath,
    isSelfClosing: !children,
    startPosition,
    endPosition,
    filePath: relativeFilePath,
  });

  discoveries.push(instance);
}
