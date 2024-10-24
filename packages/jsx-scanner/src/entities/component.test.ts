import { describe, expect, it, jest } from '@jest/globals';
import { getComponentId } from './component.ts';
import type { ImportCollection } from './import.ts';

jest.mock('./unique-id.ts', () => ({
  createUniqueId(value: string) {
    if (value === 'div') return 2;
    if (value === 'svg') return 3;
    if (value === './example.ts:Example') return 4;
    if (value === 'library:Button') return 5;
    if (value === './file.ts:FileComponent') return 6;
    if (value === 'library:Table.Body') return 7;
    if (value === 'react:default') return 8;

    return 1;
  },
}));

describe(getComponentId, () => {
  const importCollection: ImportCollection = new Map([
    ['Example', { path: './example.ts', isDefault: false }],
    ['Button', { path: 'library', isDefault: false }],
    ['Table', { path: 'library', isDefault: false }],
    ['React', { path: 'react', isDefault: true }],
  ]);

  it('returns a unique id for a built-in HTML component', () => {
    expect(getComponentId('div', importCollection, './file.ts')).toBe('html:2');
  });

  it('returns a unique id for a built-in SVG component', () => {
    expect(getComponentId('svg', importCollection, './file.ts')).toBe('svg:3');
  });

  it('returns a unique id for a component from a local import', () => {
    expect(getComponentId('Example', importCollection, './file.ts')).toBe('jsx:4');
  });

  it('returns a unique id for a component from a package import', () => {
    expect(getComponentId('Button', importCollection, './file.ts')).toBe('jsx:5');
  });

  it('returns a unique id for a component from a file path', () => {
    expect(getComponentId('FileComponent', importCollection, './file.ts')).toBe('jsx:6');
  });

  it('returns a unique id for a sub component using an import', () => {
    expect(getComponentId('Table.Body', importCollection, './file.ts')).toBe('jsx:7');
  });

  it('returns a unique id for a default import', () => {
    expect(getComponentId('React', importCollection, './file.ts')).toBe('jsx:8');
  });
});
