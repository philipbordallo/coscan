import { type CallExpression, isObjectLiteralExpression, type SourceFile, type TypeChecker } from 'typescript';
import { getComponentId } from '../components/component-id.ts';
import { createComponentInstance } from '../components/component-instance.ts';
import { getRelativeFilePath } from '../file-entities/file.ts';
import { getPosition, getPositionPath } from '../file-entities/position.ts';
import type { ImportCollection } from '../js-entities/import.ts';
import { trimQuotes } from '../js-entities/string.ts';
import { parseExpressionToObjectPropValue } from '../jsx-entities/prop.ts';
import type { JsxScannerDiscovery } from '../scanner.ts';

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

  const importMeta = importCollection.get(componentName);

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
