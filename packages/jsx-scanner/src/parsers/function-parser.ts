import {
  type ArrowFunction,
  type BindingName,
  type FunctionDeclaration,
  type FunctionExpression,
  type Identifier,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { getPosition } from '../entities/position.ts';
import { isElementReturn } from '../guards/element-return.ts';

type FunctionNode = FunctionDeclaration | FunctionExpression | ArrowFunction;

function getReturnType(
  node: FunctionNode,
  sourceFile: SourceFile,
  typeChecker: TypeChecker,
): string | undefined {
  const definedReturnType = node.type;

  if (definedReturnType) {
    return definedReturnType.getText(sourceFile);
  }

  if (!definedReturnType) {
    const signature = typeChecker.getSignatureFromDeclaration(node);

    if (signature) {
      const inferredReturnType = typeChecker.getReturnTypeOfSignature(signature);

      return typeChecker.typeToString(inferredReturnType);
    }
  }
}

type FunctionParserArgs = {
  node: FunctionNode;
  sourceFile: SourceFile;
  typeChecker: TypeChecker;
  givenName?: Identifier | BindingName;
};

export function functionParser({
  node,
  sourceFile,
  typeChecker,
  givenName,
}: FunctionParserArgs) {
  const returnType = getReturnType(node, sourceFile, typeChecker);

  if (!returnType || !isElementReturn(returnType)) return;

  const startPosition = getPosition(node.getStart(sourceFile), sourceFile);
  const endPosition = getPosition(node.getEnd(), sourceFile);

  const name = givenName?.getText(sourceFile);

  // get the props of the component
  console.log({
    name,
    returnType,
    startPosition,
    endPosition,
    filePath: sourceFile.fileName,
    positionPath: `${sourceFile.fileName}:${startPosition.line}:${startPosition.character}`,
  });
}
