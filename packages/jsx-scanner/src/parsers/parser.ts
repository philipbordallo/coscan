import {
  type CompilerOptions,
  isArrowFunction,
  isCallExpression,
  isClassDeclaration,
  isClassExpression,
  isClassLike,
  isFunctionDeclaration,
  isFunctionExpression,
  isIdentifier,
  isImportClause,
  isJsxElement,
  isJsxFragment,
  isJsxSelfClosingElement,
  isVariableDeclaration,
  type ModuleResolutionCache,
  type Node,
  SignatureKind,
  type SourceFile,
  sys as system,
  type TypeChecker,
} from 'typescript';
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
        givenName: node.name,
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
          givenName: node.name,
          importCollection,
          node: node.initializer,
          sourceFile,
          typeChecker,
        });
      }

      if (isCallExpression(node.initializer)) {
        assignParser({
          discoveries,
          givenName: node.name,
          importCollection,
          node: node.initializer,
          sourceFile,
          typeChecker,
        });
      }
    }

    if (isClassLike(node)) {
      // If node is a class expression, get parent node to determine given name
      const givenName = isClassExpression(node) && isVariableDeclaration(node.parent) && isIdentifier(node.parent.name)
        ? node.parent.name
        : node.name;

      classParser({
        discoveries,
        givenName,
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
        system,
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
