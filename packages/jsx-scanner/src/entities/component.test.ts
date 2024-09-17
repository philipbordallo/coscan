import { describe, expect, it, jest } from '@jest/globals';
import { getComponentId } from './component.ts';
import type { ImportCollection } from './import.ts';

jest.mock('./unique-id.ts', () => ({
  createUniqueId() {
    return 1;
  },
}));

describe(getComponentId, () => {
  const importCollection: ImportCollection = new Map([
    ['Example', './example.ts'],
  ]);

  it('returns a unique id for a built-in HTML component', () => {
    expect(getComponentId('div', importCollection, './file.ts')).toBe('html:1');
  });

  it('returns a unique id for a built-in SVG component', () => {
    expect(getComponentId('svg', importCollection, './file.ts')).toBe('svg:1');
  });

  it('returns a unique id for a component from an import', () => {
    expect(getComponentId('Example', importCollection, './file.ts')).toBe('jsx:1');
  });

  it('returns a unique id for a component from a file path', () => {
    expect(getComponentId('FileComponent', importCollection, './file.ts')).toBe('jsx:1');
  });
});
