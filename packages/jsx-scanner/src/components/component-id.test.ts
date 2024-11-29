import { describe, expect, it } from '@jest/globals';
import { createImportCollection } from '../js-entities/import.ts';
import { getComponentId } from './component-id.ts';
import { createUniqueId } from './component-id.ts';

describe(getComponentId, () => {
  const importCollection = createImportCollection([
    ['Example', { path: './example.ts', isDefault: false }],
    ['Button', { path: 'library', isDefault: false }],
    ['Table', { path: 'library', isDefault: false }],
    ['React', { path: 'react', isDefault: true }],
  ]);

  it('returns a unique id for a built-in HTML component', () => {
    const result = getComponentId('div', importCollection, './file.ts');
    const expectation = `html:${createUniqueId('div')}`;

    expect(result).toBe(expectation);
  });

  it('returns a unique id for a built-in SVG component', () => {
    const result = getComponentId('svg', importCollection, './file.ts');
    const expectation = `svg:${createUniqueId('svg')}`;

    expect(result).toBe(expectation);
  });

  it('returns a unique id for a component from a local import', () => {
    const result = getComponentId('Example', importCollection, './file.ts');
    const expectation = `jsx:${createUniqueId('./example.ts:Example')}`;

    expect(result).toBe(expectation);
  });

  it('returns a unique id for a component from a package import', () => {
    const result = getComponentId('Button', importCollection, './file.ts');
    const expectation = `jsx:${createUniqueId('library:Button')}`;

    expect(result).toBe(expectation);
  });

  it('returns a unique id for a component from a file path', () => {
    const result = getComponentId('FileComponent', importCollection, './file.ts');
    const expectation = `jsx:${createUniqueId('./file.ts:FileComponent')}`;

    expect(result).toBe(expectation);
  });

  it('returns a unique id for a sub component using an import', () => {
    const result = getComponentId('Table.Body', importCollection, './file.ts');
    const expectation = `jsx:${createUniqueId('library:Table.Body')}`;

    expect(result).toBe(expectation);
  });

  it('returns a unique id for a default import', () => {
    const result = getComponentId('React', importCollection, './file.ts');
    const expectation = `jsx:${createUniqueId('react:default')}`;

    expect(result).toBe(expectation);
  });
});
