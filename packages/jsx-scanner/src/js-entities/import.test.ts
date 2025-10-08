import { describe, expect, it } from '@coscan/test';
import { createImportCollection, ImportCollection } from './import.ts';

describe(ImportCollection.name, () => {
  it('should allow for an import to be added', () => {
    const importCollection = createImportCollection();

    importCollection.set('React', {
      path: 'react',
      isDefault: true,
    });

    expect(importCollection.get('React')).toEqual({
      path: 'react',
      isDefault: true,
    });
  });

  it('should allow for an import to be aliased', () => {
    const importCollection = createImportCollection([
      ['differentLibrary', {
        isDefault: false,
        path: 'library',
        originalName: 'library',
      }],
    ]);

    expect(importCollection.get('differentLibrary')).toEqual({
      path: 'library',
      isDefault: false,
      originalName: 'library',
    });
  });

  it('resolves the namespace for an import', () => {
    const importCollection = createImportCollection([
      ['React', {
        isDefault: true,
        path: 'react',
      }],
    ]);

    expect(importCollection.get('React.Fragment')).toEqual({
      path: 'react',
      isDefault: true,
    });
  });
});
