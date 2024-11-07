import { isJsxSelfClosingElement, type JsxElement, type JsxSelfClosingElement, type SourceFile } from 'typescript';
import { type ComponentName, createComponentInstance, getComponentId } from '../entities/component.ts';
import type { ComponentInstance } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import { getProps } from '../entities/prop.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';
import { getNamespace } from '../entities/string.ts';

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

  const importKey = getNamespace(componentName) ?? componentName;
  const importMeta = importCollection.get(importKey);

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
