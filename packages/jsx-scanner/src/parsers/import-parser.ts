import {
  type CompilerOptions,
  type ImportClause,
  type ModuleResolutionCache,
  resolveModuleName,
  type SourceFile,
  type System,
} from 'typescript';
import { type FilePath, getRelativeFilePath } from '../entities/file.ts';
import { type ImportCollection, ImportPath } from '../entities/import.ts';

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
  const importedFrom = node.parent?.moduleSpecifier
    .getText(sourceFile)
    .replace(/['"]+/g, '');

  const filePath: FilePath = sourceFile.fileName;
  const { resolvedModule } = resolveModuleName(
    importedFrom,
    filePath,
    compilerOptions,
    system,
    moduleResolutionCache,
  );

  if (!resolvedModule) return;

  const resolvedImportPath: ImportPath = resolvedModule.isExternalLibraryImport
    ? importedFrom
    : getRelativeFilePath(resolvedModule.resolvedFileName);

  if (node.name) {
    const name = node.name.getText(sourceFile);
    importCollection.set(name, resolvedImportPath);
  }

  if (node.namedBindings) {
    node.namedBindings.forEachChild((element) => {
      const name = element.getText(sourceFile);
      importCollection.set(name, resolvedImportPath);
    });
  }
}
