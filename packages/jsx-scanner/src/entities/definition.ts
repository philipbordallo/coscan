import type { ComponentId, ComponentName } from './component.ts';
import type { FilePath } from './file.ts';
import type { Position } from './position.ts';

export type Definition = {
  type: 'definition';
  filePath: FilePath;
  positionPath: string;
  componentName: ComponentName;
  componentId: ComponentId;
  startPosition: Position;
  endPosition: Position;
};
