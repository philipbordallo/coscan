import { isJsxSelfClosingElement, type JsxElement, type JsxSelfClosingElement, type SourceFile } from 'typescript';
import { type ComponentName, getComponentId } from '../entities/component.ts';
import type { ComponentInstance } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import { getProps } from '../entities/prop.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';

type ElementParserArgs = {
  node: JsxElement | JsxSelfClosingElement;
  importCollection: ImportCollection;
  sourceFile: SourceFile;
  discoveries: JsxScannerDiscovery[];
};

export function elementParser({ discoveries, node, importCollection, sourceFile }: ElementParserArgs) {
  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const isSelfClosing = isJsxSelfClosingElement(node);
  const element = isSelfClosing ? node : node.openingElement;

  const relativeFilePath = getRelativeFilePath(sourceFile);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

  const componentName: ComponentName = element.tagName.getText(sourceFile);
  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const props = getProps(element.attributes, sourceFile);

  const instance: ComponentInstance = {
    type: 'instance',
    componentName,
    componentId,
    filePath: relativeFilePath,
    importPath: importCollection.get(componentName),
    positionPath,
    isSelfClosing,
    props,
    startPosition,
    endPosition,
  };

  discoveries.push(instance);
}
