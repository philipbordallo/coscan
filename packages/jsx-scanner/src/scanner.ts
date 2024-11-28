import path from 'node:path';
import {
  type CompilerOptions,
  createCompilerHost,
  createModuleResolutionCache,
  createProgram,
  JsxEmit,
} from 'typescript';
import { type ComponentDefinition, type ComponentInstance } from './component.ts';
import { createImportCollection, ImportCollection } from './js-entities/import.ts';
import { parser } from './parsers/parser.ts';

export type JsxScannerDiscovery = ComponentDefinition | ComponentInstance;

type JsxScannerConfig = {
  files: string[];
};

export async function jsxScanner(config: JsxScannerConfig): Promise<JsxScannerDiscovery[]> {
  const compilerOptions: CompilerOptions = {
    jsx: JsxEmit.React,
    checkJs: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
  };

  const discoveries: JsxScannerDiscovery[] = [];

  const host = createCompilerHost(compilerOptions);

  const program = createProgram(
    // Make sure files are resolved to absolute paths
    config.files.map((file) => path.resolve(file)),
    compilerOptions,
    host,
  );

  const currentDirectory = program.getCurrentDirectory();
  const sourceFiles = program.getSourceFiles();
  const typeChecker = program.getTypeChecker();

  const moduleResolutionCache = createModuleResolutionCache(
    currentDirectory,
    host.getCanonicalFileName,
    compilerOptions,
  );

  sourceFiles.forEach((sourceFile) => {
    // Skip declaration files
    if (sourceFile.isDeclarationFile) return;

    const importCollection = createImportCollection();

    // Parse the source file
    const parse = parser({
      compilerOptions,
      discoveries,
      importCollection,
      moduleResolutionCache,
      sourceFile,
      typeChecker,
    });

    // Visit the source file
    sourceFile.forEachChild(parse);
  });

  return discoveries;
}
