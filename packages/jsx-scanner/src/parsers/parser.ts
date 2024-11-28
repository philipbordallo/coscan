import {
  type CompilerOptions,
  isClassLike,
  isFunctionDeclaration,
  isImportClause,
  isJsxElement,
  isJsxFragment,
  isJsxSelfClosingElement,
  type ModuleResolutionCache,
  type Node,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { getGivenName } from '../js-entities/declaration.ts';
import { isFunctionCall } from '../js-entities/function.ts';
import { isInitializedFunctionExpression } from '../js-entities/function.ts';
import { type ImportCollection } from '../js-entities/import.ts';
import { isInitializedVariable } from '../js-entities/variable.ts';
import { type JsxScannerDiscovery } from '../scanner.ts';
import { assignParser, OBJECT_ASSIGN_CALLEES } from './assign-parser.ts';
import { classParser } from './class-parser.ts';
import { elementParser } from './element-parser.ts';
import { fragmentParser } from './fragment-parser.ts';
import { functionParser } from './function-parser.ts';
import { importParser } from './import-parser.ts';
import { REACT_BUILTIN_ELEMENT_CALLEES, reactBuiltinElementParser } from './react-builtin-element-parser.ts';
import { REACT_BUILTIN_CALLEES, reactBuiltinParser } from './react-builtin-parser.ts';

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
    if (isFunctionDeclaration(node) || isInitializedFunctionExpression(node)) {
      functionParser({
        discoveries,
        givenName: getGivenName(node, sourceFile),
        importCollection,
        node: isInitializedFunctionExpression(node) ? node.initializer : node,
        sourceFile,
        typeChecker,
      });
    }

    if (isInitializedVariable(node) && isFunctionCall(node.initializer, OBJECT_ASSIGN_CALLEES, sourceFile)) {
      assignParser({
        discoveries,
        givenName: getGivenName(node, sourceFile),
        importCollection,
        node: node.initializer,
        sourceFile,
        typeChecker,
      });
    }

    if (isInitializedVariable(node) && isFunctionCall(node.initializer, REACT_BUILTIN_CALLEES, sourceFile)) {
      reactBuiltinParser({
        discoveries,
        givenName: getGivenName(node, sourceFile),
        importCollection,
        node,
        sourceFile,
        typeChecker,
      });
    }

    if (isFunctionCall(node, REACT_BUILTIN_ELEMENT_CALLEES, sourceFile)) {
      reactBuiltinElementParser({
        discoveries,
        importCollection,
        node,
        sourceFile,
        typeChecker,
      });
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
