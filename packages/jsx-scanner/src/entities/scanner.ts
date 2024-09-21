import {
  type CompilerOptions,
  createCompilerHost,
  createModuleResolutionCache,
  createProgram,
  JsxEmit,
} from 'typescript';
import { parser } from '../parsers/parser.ts';
import { type ComponentDefinition, type ComponentInstance } from './component.ts';
import { type ImportCollection } from './import.ts';

export type JsxScannerDiscovery = ComponentDefinition | ComponentInstance;

type JsxScannerConfig = {
  files: string[];
};

export async function jsxScanner(config: JsxScannerConfig): Promise<JsxScannerDiscovery[]> {
  const compilerOptions: CompilerOptions = {
    jsx: JsxEmit.React,
    checkJs: true,
  };

  const discoveries: JsxScannerDiscovery[] = [];

  const host = createCompilerHost(compilerOptions);

  const program = createProgram(
    config.files,
    compilerOptions,
    host,
  );

  const sourceFiles = program.getSourceFiles();
  const moduleResolutionCache = createModuleResolutionCache(
    process.cwd(),
    host.getCanonicalFileName,
    compilerOptions,
  );
  const typeChecker = program.getTypeChecker();

  sourceFiles.forEach((sourceFile) => {
    // Skip declaration files
    if (sourceFile.isDeclarationFile) return;

    const importCollection: ImportCollection = new Map();

    // Parse the source file
    const parse = parser({
      discoveries,
      sourceFile,
      importCollection,
      moduleResolutionCache,
      compilerOptions,
      typeChecker,
    });

    // Visit the source file
    sourceFile.forEachChild(parse);
  });

  return discoveries;
}
