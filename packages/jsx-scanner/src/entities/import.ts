export type Import = string;
export type ImportPath = string;
export type ImportMeta = {
  isDefault: boolean;
  path: ImportPath;
};
export type ImportCollection = Map<Import, ImportMeta>;
