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
  type TypeChecker,
} from 'typescript';
import { type ImportCollection } from '../entities/import.ts';
import { type JsxScannerDiscovery } from '../entities/scanner.ts';
import { elementParser } from './element-parser.ts';
import { functionParser } from './function-parser.ts';
import { importParser } from './import-parser.ts';

export type ParserArgs = {
  discoveries: JsxScannerDiscovery[];
  importCollection: ImportCollection;
  sourceFile: SourceFile;
  moduleResolutionCache: ModuleResolutionCache;
  compilerOptions: CompilerOptions;
  typeChecker: TypeChecker;
};

export function parser({
  sourceFile,
  importCollection,
  moduleResolutionCache,
  compilerOptions,
  typeChecker,
  discoveries,
}: ParserArgs) {
  return (node: Node) => {
    if (isFunctionDeclaration(node)) {
      functionParser({ discoveries, importCollection, node, sourceFile, typeChecker, givenName: node.name });
    }

    if (isVariableDeclaration(node) && node.initializer) {
      if (isFunctionExpression(node.initializer) || isArrowFunction(node.initializer)) {
        functionParser({
          discoveries,
          importCollection,
          node: node.initializer,
          sourceFile,
          typeChecker,
          givenName: node.name,
        });
      }
    }

    if (isJsxElement(node) || isJsxSelfClosingElement(node)) {
      elementParser({ discoveries, importCollection, node, sourceFile });
    }

    if (isImportClause(node)) {
      importParser({
        importCollection,
        node,
        sourceFile,
        moduleResolutionCache,
        compilerOptions,
        system,
      });
    }

    const parse = parser({
      discoveries,
      sourceFile,
      importCollection,
      moduleResolutionCache,
      compilerOptions,
      typeChecker,
    });

    node.forEachChild(parse);
  };
}
