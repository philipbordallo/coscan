import type { FilePath } from '../file-entities/file.ts';
import type { Position, PositionPath } from '../file-entities/position.ts';
import type { ComponentId } from './component-id.ts';
import type { ComponentName } from './component-name.ts';

export type ComponentDefinition = {
  type: 'definition';
  componentName: ComponentName;
  componentId: ComponentId;
  filePath: FilePath;
  location: PositionPath;
  startPosition: Position;
  endPosition: Position;
};
type ComponentDefinitionArgs = Omit<ComponentDefinition, 'type'>;

export function createComponentDefinition({
  componentId,
  componentName,
  filePath,
  location,
  startPosition,
  endPosition,
}: ComponentDefinitionArgs): ComponentDefinition {
  return {
    type: 'definition',
    componentName,
    componentId,
    filePath,
    location,
    startPosition,
    endPosition,
  };
}
