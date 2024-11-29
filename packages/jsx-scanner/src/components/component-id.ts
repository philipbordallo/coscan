import { createHash } from 'crypto';
import type { FilePath } from '../file-entities/file.ts';
import type { ImportCollection } from '../js-entities/import.ts';
import { isBuiltInHtml } from '../jsx-entities/built-in-html.ts';
import { isBuiltInSvg } from '../jsx-entities/built-in-svg.ts';
import type { ComponentName } from './component-name.ts';

export type UniqueId = string;

export function createUniqueId(string: string): UniqueId {
  const hash = createHash('sha1').update(string);

  return hash.digest('hex');
}

export type ComponentId = `${'html' | 'svg' | 'jsx'}:${UniqueId}`;

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
