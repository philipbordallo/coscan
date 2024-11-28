import { isJsxSelfClosingElement, type JsxElement, type JsxSelfClosingElement, type SourceFile } from 'typescript';
import { type ComponentName, createComponentInstance, getComponentId } from '../component.ts';
import { getRelativeFilePath } from '../file.ts';
import type { ImportCollection } from '../import.ts';
import { getPosition, getPositionPath } from '../position.ts';
import { getProps } from '../prop.ts';
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

  const props = getProps(element.attributes, sourceFile);

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
