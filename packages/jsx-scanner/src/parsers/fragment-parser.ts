import type { JsxFragment, SourceFile } from 'typescript';
import { type ComponentInstance, type ComponentName, getComponentId } from '../entities/component.ts';
import { getRelativeFilePath } from '../entities/file.ts';
import type { ImportCollection } from '../entities/import.ts';
import { getPosition, getPositionPath } from '../entities/position.ts';
import type { JsxScannerDiscovery } from '../entities/scanner.ts';

type FragmentParserArgs = {
  discoveries: JsxScannerDiscovery[];
  node: JsxFragment;
  importCollection: ImportCollection;
  sourceFile: SourceFile;
};

export function fragmentParser({ node, sourceFile, importCollection, discoveries }: FragmentParserArgs) {
  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);
  const relativeFilePath = getRelativeFilePath(sourceFile);

  const componentName: ComponentName = 'Fragment';

  const componentId = getComponentId(componentName, importCollection, relativeFilePath);
  const positionPath = getPositionPath(startPosition, relativeFilePath);

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
