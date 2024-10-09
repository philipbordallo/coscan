import { isBuiltInHtml } from '../guards/built-in-html.ts';
import { isBuiltInSvg } from '../guards/built-in-svg.ts';
import { type FilePath } from './file.ts';
import { type ImportCollection, type ImportPath } from './import.ts';
import type { Position, PositionPath } from './position.ts';
import type { Props } from './prop.ts';
import { getNamespace } from './string.ts';
import { createUniqueId, type UniqueId } from './unique-id.ts';

export type ComponentId = `${'html' | 'svg' | 'jsx'}:${UniqueId}`;
export type ComponentName = string;

export type ComponentDefinition = {
  type: 'definition';
  componentName: ComponentName;
  componentId: ComponentId;
  filePath: FilePath;
  location: PositionPath;
  startPosition: Position;
  endPosition: Position;
};

export type ComponentInstance = {
  type: 'instance';
  componentName: ComponentName;
  componentId: ComponentId;
  importedFrom?: ImportPath;
  filePath: FilePath;
  location: PositionPath;
  isSelfClosing: boolean;
  props: Props;
  startPosition: Position;
  endPosition: Position;
};

export function getComponentId(
  name: ComponentName,
  importCollection: ImportCollection,
  filePath: FilePath,
): ComponentId {
  const importkey = getNamespace(name) ?? name;
  const importPath = importCollection.get(importkey);

  if (isBuiltInHtml(name)) {
    const id = createUniqueId(name);
    return `html:${id}`;
  }

  if (isBuiltInSvg(name)) {
    const id = createUniqueId(name);
    return `svg:${id}`;
  }

  if (importPath) {
    const id = createUniqueId(`${importPath}:${name}`);
    return `jsx:${id}`;
  }

  const id = createUniqueId(`${filePath}:${name}`);
  return `jsx:${id}`;
}
