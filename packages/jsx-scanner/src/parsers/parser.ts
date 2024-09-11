import {
  type CompilerOptions,
  isArrowFunction,
  isFunctionDeclaration,
  isFunctionExpression,
  isImportClause,
  isJsxElement,
  isJsxSelfClosingElement,
  isVariableDeclaration,
  type ModuleResolutionCache,
  type Node,
  type SourceFile,
  sys as system,
  TypeChecker,
} from 'typescript';
import { type ImportCollection } from '../entities/import.ts';
import { type Instances } from '../entities/instance.ts';
import { elementParser } from './element-parser.ts';
import { functionParser } from './function-parser.ts';
import { importParser } from './import-parser.ts';

type ParserArgs = {
  instances: Instances;
  importCollection: ImportCollection;
  sourceFile: SourceFile;
  moduleResolutionCache: ModuleResolutionCache;
  compilerOptions: CompilerOptions;
  typeChecker: TypeChecker;
};

export function parser({
  instances,
  sourceFile,
  importCollection,
  moduleResolutionCache,
  compilerOptions,
  typeChecker,
}: ParserArgs) {
  return (node: Node) => {
    if (isFunctionDeclaration(node)) {
      functionParser({ node, sourceFile, typeChecker, givenName: node.name });
    }

    if (isVariableDeclaration(node) && node.initializer) {
      if (isFunctionExpression(node.initializer) || isArrowFunction(node.initializer)) {
        functionParser({ node: node.initializer, sourceFile, typeChecker, givenName: node.name });
      }
    }

    if (isJsxElement(node) || isJsxSelfClosingElement(node)) {
      elementParser({ node, instances, importCollection, sourceFile });
    }

    if (isImportClause(node)) {
      importParser({
        node,
        sourceFile,
        importCollection,
        moduleResolutionCache,
        compilerOptions,
        system,
      });
    }

    const parse = parser({
      instances,
      sourceFile,
      importCollection,
      moduleResolutionCache,
      compilerOptions,
      typeChecker,
    });

    node.forEachChild(parse);
  };
}
