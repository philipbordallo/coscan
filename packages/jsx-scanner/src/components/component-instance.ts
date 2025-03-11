import type { FilePath } from '../file-entities/file.ts';
import type { Position, PositionPath } from '../file-entities/position.ts';
import type { ImportPath } from '../js-entities/import.ts';
import type { PropsInstance } from '../jsx-entities/prop.ts';
import type { ComponentId } from './component-id.ts';
import type { ComponentName } from './component-name.ts';

export type ComponentInstance = {
  type: 'instance';
  componentName: ComponentName;
  componentId: ComponentId;
  importedFrom?: ImportPath;
  filePath: FilePath;
  location: PositionPath;
  isSelfClosing: boolean;
  props: PropsInstance;
  startPosition: Position;
  endPosition: Position;
};
type CreateComponentInstanceArgs = Omit<ComponentInstance, 'type'>;

export function createComponentInstance({
  componentId,
  componentName,
  filePath,
  importedFrom,
  isSelfClosing,
  location,
  props,
  startPosition,
  endPosition,
}: CreateComponentInstanceArgs): ComponentInstance {
  return {
    type: 'instance',
    componentName,
    componentId,
    importedFrom,
    filePath,
    location,
    isSelfClosing,
    props,
    startPosition,
    endPosition,
  };
}
