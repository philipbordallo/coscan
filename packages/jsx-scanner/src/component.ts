import { type FilePath } from './file-entities/file.ts';
import type { Position, PositionPath } from './file-entities/position.ts';
import { type ImportCollection, type ImportPath } from './js-entities/import.ts';
import { isBuiltInHtml } from './jsx-entities/built-in-html.ts';
import { isBuiltInSvg } from './jsx-entities/built-in-svg.ts';
import type { Props } from './jsx-entities/prop.ts';
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

export function getComponentId(
  name: ComponentName,
  importCollection: ImportCollection,
  filePath: FilePath,
): ComponentId {
  const importMeta = importCollection.get(name);

  if (isBuiltInHtml(name)) {
    const id = createUniqueId(name);
    return `html:${id}`;
  }

  if (isBuiltInSvg(name)) {
    const id = createUniqueId(name);
    return `svg:${id}`;
  }

  if (importMeta?.isDefault) {
    const id = createUniqueId(`${importMeta.path}:default`);
    return `jsx:${id}`;
  }

  if (importMeta?.originalName) {
    const id = createUniqueId(`${importMeta.path}:${importMeta.originalName}`);
    return `jsx:${id}`;
  }

  if (importMeta) {
    const id = createUniqueId(`${importMeta.path}:${name}`);
    return `jsx:${id}`;
  }

  const id = createUniqueId(`${filePath}:${name}`);
  return `jsx:${id}`;
}
