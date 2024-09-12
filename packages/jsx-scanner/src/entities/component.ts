import { isBuiltInHtml } from '../guards/built-in-html.ts';
import { isBuiltInSvg } from '../guards/built-in-svg.ts';
import { FilePath } from './file.ts';
import { ImportCollection } from './import.ts';
import { createUniqueId, type UniqueId } from './unique-id.ts';

export type ComponentId = `${'html' | 'svg' | 'jsx'}:${UniqueId}`;
export type ComponentName = string;

export function getComponentId(
  name: ComponentName,
  importCollection: ImportCollection,
  filePath: FilePath,
): ComponentId {
  const importPath = importCollection.get(name);

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
