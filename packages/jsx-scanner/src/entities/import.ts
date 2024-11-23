import { getNamespace } from './string.ts';

type ImportKey = string;
export type ImportPath = string;

type ImportMeta = {
  isDefault: boolean;
  path: ImportPath;
  /** The original exported name if an import is aliased. */
  originalName?: string;
};

type ImportCollectionEntry = readonly [ImportKey, ImportMeta];

/**
 * A collection of import keys mapped to import metadata, including whether the import is default imported, its path, and if aliased its original name.
 */
export class ImportCollection extends Map<ImportKey, ImportMeta> {
  constructor(entries?: readonly ImportCollectionEntry[] | null) {
    super(entries);
  }

  set(key: ImportKey, meta: ImportMeta): this {
    return super.set(key, meta);
  }

  get(key: ImportKey): ImportMeta | undefined {
    const resolvedKey = getNamespace(key) ?? key;

    return super.get(resolvedKey);
  }
}

export function createImportCollection(entries?: readonly ImportCollectionEntry[] | null): ImportCollection {
  return new ImportCollection(entries);
}
