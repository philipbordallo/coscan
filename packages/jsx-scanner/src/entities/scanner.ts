import {
  type CompilerOptions,
  createCompilerHost,
  createModuleResolutionCache,
  createProgram,
  JsxEmit,
} from 'typescript';
import { parser } from '../parsers/parser.ts';
import { Component, type ComponentId, type ComponentName } from './component.ts';
import { type ImportCollection } from './import.ts';
import { type Instances } from './instance.ts';

type GroupRecord = Record<ComponentId, Instances>;
type ComponentCollection = Map<ComponentId, ComponentName>;

type jsxScannerConfig = {
  files: string[];
};

export async function jsxScanner(config: jsxScannerConfig): Promise<Component[]> {
  const compilerOptions: CompilerOptions = {
    jsx: JsxEmit.React,
    checkJs: true,
  };

  const host = createCompilerHost(compilerOptions);

  const program = createProgram(
    config.files,
    compilerOptions,
    host,
  );

  const instances: Instances = [];
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
      instances,
      sourceFile,
      importCollection,
      moduleResolutionCache,
      compilerOptions,
      typeChecker,
    });

    // Visit the source file
    sourceFile.forEachChild(parse);
  });

  const componentCollection: ComponentCollection = new Map();

  // Group instances by component id
  const groupRecord = instances.reduce<GroupRecord>((acc, instance) => {
    const groupInstances: Instances = acc[instance.componentId] || [];

    componentCollection.set(instance.componentId, instance.componentName);

    return {
      ...acc,
      [instance.componentId]: [...groupInstances, {
        ...instance,
      }],
    };
  }, {});

  const entries = Object.entries(groupRecord) as [ComponentId, Instances][];

  const output = entries.map(([id, instances]) => {
    const component = componentCollection.get(id);

    if (!component) throw new Error(`Component not found for id: ${id}`);

    return { name: component, id, count: instances.length, instances };
  });

  return output;
}
