import type { JsxFragment, SourceFile } from 'typescript';
import { type ComponentInstance, type ComponentName, getComponentId } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';

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

  const componentName: ComponentName = 'Fragment';
  const componentId = getComponentId(componentName, importCollection, relativeFilePath);

  const instance: ComponentInstance = {
    type: 'instance',
    componentName,
    componentId,
    filePath: relativeFilePath,
    positionPath,
    isSelfClosing: false,
    props: {},
    startPosition,
    endPosition,
  };

  discoveries.push(instance);
}
