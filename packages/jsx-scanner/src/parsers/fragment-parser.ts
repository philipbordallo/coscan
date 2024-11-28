import type { JsxFragment, SourceFile } from 'typescript';
import { type ComponentName, createComponentInstance, getComponentId } from '../component.ts';
import { getRelativeFilePath } from '../file.ts';
import type { ImportCollection } from '../import.ts';
import { getPosition, getPositionPath } from '../position.ts';
import type { JsxScannerDiscovery } from '../scanner.ts';

type FragmentParserArgs = {
  discoveries: JsxScannerDiscovery[];
  importCollection: ImportCollection;
  node: JsxFragment;
  sourceFile: SourceFile;
};

export function fragmentParser({
  discoveries,
  importCollection,
  node,
  sourceFile,
}: FragmentParserArgs) {
  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const relativeFilePath = getRelativeFilePath(sourceFile.fileName);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

  const componentName: ComponentName = 'React.Fragment';
  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const instance = createComponentInstance({
    componentName,
    componentId,
    filePath: relativeFilePath,
    location: positionPath,
    isSelfClosing: false,
    props: {},
    startPosition,
    endPosition,
  });

  discoveries.push(instance);
}
