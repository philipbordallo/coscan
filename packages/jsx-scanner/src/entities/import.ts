export type Import = string;
export type ImportPath = string;
export type ImportMeta = {
  isDefault: boolean;
  path: ImportPath;
  /** The original exported name if an import is aliased. */
  originalName?: string;
};
export type ImportCollection = Map<Import, ImportMeta>;
