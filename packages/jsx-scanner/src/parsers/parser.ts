import {
  type CompilerOptions,
  isArrowFunction,
  isCallExpression,
  isClassLike,
  isFunctionDeclaration,
  isFunctionExpression,
  isImportClause,
  isJsxElement,
  isJsxFragment,
  isJsxSelfClosingElement,
  isVariableDeclaration,
  type ModuleResolutionCache,
  type Node,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { getGivenName } from '../entities/declaration.ts';
import { type ImportCollection } from '../entities/import.ts';
import { type JsxScannerDiscovery } from '../entities/scanner.ts';
import { assignParser } from './assign-parser.ts';
import { classParser } from './class-parser.ts';
import { elementParser } from './element-parser.ts';
import { fragmentParser } from './fragment-parser.ts';
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
  compilerOptions,
  discoveries,
  importCollection,
  moduleResolutionCache,
  sourceFile,
  typeChecker,
}: ParserArgs) {
  return (node: Node) => {
    if (isFunctionDeclaration(node)) {
      functionParser({
        discoveries,
        givenName: getGivenName(node, sourceFile),
        importCollection,
        node,
        sourceFile,
        typeChecker,
      });
    }

    if (isVariableDeclaration(node) && node.initializer) {
      if (isFunctionExpression(node.initializer) || isArrowFunction(node.initializer)) {
        functionParser({
          discoveries,
          givenName: getGivenName(node, sourceFile),
          importCollection,
          node: node.initializer,
          sourceFile,
          typeChecker,
        });
      }

      if (isCallExpression(node.initializer)) {
        assignParser({
          discoveries,
          givenName: getGivenName(node, sourceFile),
          importCollection,
          node: node.initializer,
          sourceFile,
          typeChecker,
        });
      }
    }

    if (isClassLike(node)) {
      classParser({
        discoveries,
        givenName: getGivenName(node, sourceFile),
        importCollection,
        node,
        sourceFile,
        typeChecker,
      });
    }

    if (isJsxElement(node) || isJsxSelfClosingElement(node)) {
      elementParser({
        discoveries,
        importCollection,
        node,
        sourceFile,
      });
    }

    if (isJsxFragment(node)) {
      fragmentParser({
        discoveries,
        importCollection,
        node,
        sourceFile,
      });
    }

    if (isImportClause(node)) {
      importParser({
        compilerOptions,
        importCollection,
        moduleResolutionCache,
        node,
        sourceFile,
      });
    }

    const parse = parser({
      compilerOptions,
      discoveries,
      importCollection,
      moduleResolutionCache,
      sourceFile,
      typeChecker,
    });

    node.forEachChild(parse);
  };
}
