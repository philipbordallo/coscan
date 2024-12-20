import {
  type CompilerOptions,
  type ImportClause,
  isImportSpecifier,
  type ModuleResolutionCache,
  resolveModuleName,
  type SourceFile,
  sys as system,
} from 'typescript';
import { type FilePath, getRelativeFilePath } from '../file-entities/file.ts';
import { type ImportCollection, ImportPath } from '../js-entities/import.ts';
import { trimQuotes } from '../js-entities/string.ts';

type ImportParserArgs = {
  compilerOptions: CompilerOptions;
  importCollection: ImportCollection;
  moduleResolutionCache: ModuleResolutionCache;
  node: ImportClause;
  sourceFile: SourceFile;
};

export function importParser({
  compilerOptions,
  importCollection,
  moduleResolutionCache,
  node,
  sourceFile,
}: ImportParserArgs) {
  const moduleName = trimQuotes(
    node.parent?.moduleSpecifier
      .getText(sourceFile),
  );

  const filePath: FilePath = sourceFile.fileName;
  const { resolvedModule } = resolveModuleName(
    moduleName,
    filePath,
    compilerOptions,
    system,
    moduleResolutionCache,
  );

  if (!resolvedModule) return;

  const resolvedImportPath: ImportPath = resolvedModule.isExternalLibraryImport
    ? moduleName
    : getRelativeFilePath(resolvedModule.resolvedFileName);

  /**
   * Handles:
   * - `import library from 'library'`
   */
  if (node.name) {
    const key = node.name.getText(sourceFile);

    importCollection.set(key, { path: resolvedImportPath, isDefault: true });
  }

  /**
   * Handles:
   * - `import * as library from 'library'`
   * - `import { library } from 'library'`
   * - `import { library as aliasedName } from 'library'`
   */
  if (node.namedBindings) {
    node.namedBindings.forEachChild((nameBinding) => {
      if (!isImportSpecifier(nameBinding)) return;

      const key = nameBinding.name.getText(sourceFile);
      const originalName = nameBinding.propertyName?.getText(sourceFile);

      importCollection.set(key, { path: resolvedImportPath, isDefault: false, originalName });
    });
  }
}
