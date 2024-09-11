import { isJsxSelfClosingElement, type JsxElement, type JsxSelfClosingElement, type SourceFile } from 'typescript';
import { ComponentName, getComponentId } from '../entities/component.ts';
import { ImportCollection } from '../entities/import.ts';
import { Instances } from '../entities/instance.ts';
import { getPosition } from '../entities/position.ts';
import { getProps } from '../entities/prop.ts';

type ElementParserArgs = {
  node: JsxElement | JsxSelfClosingElement;
  instances: Instances;
  importCollection: ImportCollection;
  sourceFile: SourceFile;
};

export function elementParser({ node, instances, importCollection, sourceFile }: ElementParserArgs) {
  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const isSelfClosing = isJsxSelfClosingElement(node);
  const element = isSelfClosing ? node : node.openingElement;

  const name: ComponentName = element.tagName.getText(sourceFile);
  const props = getProps(element.attributes, sourceFile);
  const componentId = getComponentId(name, importCollection, sourceFile.fileName);

  instances.push({
    componentName: name,
    componentId,
    filePath: sourceFile.fileName,
    importPath: importCollection.get(name),
    positionPath: `${sourceFile.fileName}:${startPosition.line}:${startPosition.character}`,
    isSelfClosing,
    props,
    startPosition,
    endPosition,
  });
}
