import type { ComponentId, ComponentName } from './component.ts';
import type { FilePath } from './file.ts';
import type { ImportPath } from './import.ts';
import type { Position } from './position.ts';
import type { Props } from './prop.ts';

export type Instance = {
  type: 'instance';
  filePath: FilePath;
  importPath?: ImportPath;
  positionPath: string;
  props: Props;
  componentName: ComponentName;
  componentId: ComponentId;
  isSelfClosing: boolean;
  startPosition: Position;
  endPosition: Position;
};
