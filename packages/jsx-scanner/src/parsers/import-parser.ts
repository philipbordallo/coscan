import {
  type CompilerOptions,
  type ImportClause,
  type ModuleResolutionCache,
  type Node,
  resolveModuleName,
  type SourceFile,
  type System,
} from 'typescript';
import { type FilePath, getRelativeFilePath } from '../entities/file.ts';
import { type ImportCollection, ImportPath } from '../entities/import.ts';

/**
 * Get an aliased import name from a named import binding.
 * @example
 * `thing as other` -> 'other'
 */
function getAliasedName(nameBinding: Node, sourceFile?: SourceFile): string | undefined {
  const lastToken = nameBinding.getLastToken(sourceFile);

  return lastToken?.getText(sourceFile);
}

type ImportParserArgs = {
  compilerOptions: CompilerOptions;
  importCollection: ImportCollection;
  moduleResolutionCache: ModuleResolutionCache;
  node: ImportClause;
  sourceFile: SourceFile;
  system: System;
};

export function importParser({
  compilerOptions,
  importCollection,
  moduleResolutionCache,
  node,
  sourceFile,
  system,
}: ImportParserArgs) {
  const moduleName = node.parent?.moduleSpecifier
    .getText(sourceFile)
    .replace(/['"]+/g, '');

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
    const name = node.name.getText(sourceFile);

    importCollection.set(name, resolvedImportPath);
  }

  /**
   * Handles:
   * - `import * as library from 'library'`
   * - `import { library } from 'library'`
   * - `import { library as aliasedName } from 'library'`
   */
  if (node.namedBindings) {
    node.namedBindings.forEachChild((nameBinding) => {
      const name = getAliasedName(nameBinding, sourceFile) ?? nameBinding.getText(sourceFile);

      importCollection.set(name, resolvedImportPath);
    });
  }
}
