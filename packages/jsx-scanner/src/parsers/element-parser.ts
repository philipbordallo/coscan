import { isJsxSelfClosingElement, type JsxElement, type JsxSelfClosingElement, type SourceFile } from 'typescript';
import { getComponentId } from '../components/component-id.ts';
import { createComponentInstance } from '../components/component-instance.ts';
import { type ComponentName } from '../components/component-name.ts';
import { getRelativeFilePath } from '../file-entities/file.ts';
import { getPosition, getPositionPath } from '../file-entities/position.ts';
import type { ImportCollection } from '../js-entities/import.ts';
import { createPropsInstance } from '../jsx-entities/prop.ts';
import type { JsxScannerDiscovery } from '../scanner.ts';

type ElementParserArgs = {
  discoveries: JsxScannerDiscovery[];
  importCollection: ImportCollection;
  node: JsxElement | JsxSelfClosingElement;
  sourceFile: SourceFile;
};

export function elementParser({
  discoveries,
  importCollection,
  node,
  sourceFile,
}: ElementParserArgs) {
  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const isSelfClosing = isJsxSelfClosingElement(node);
  const element = isSelfClosing ? node : node.openingElement;

  const relativeFilePath = getRelativeFilePath(sourceFile.fileName);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

  const componentName: ComponentName = element.tagName.getText(sourceFile);
  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const importMeta = importCollection.get(componentName);

  const props = createPropsInstance(element.attributes, sourceFile);

  const instance = createComponentInstance({
    componentName,
    componentId,
    importedFrom: importMeta?.path,
    filePath: relativeFilePath,
    location: positionPath,
    isSelfClosing,
    props,
    startPosition,
    endPosition,
  });

  discoveries.push(instance);
}
