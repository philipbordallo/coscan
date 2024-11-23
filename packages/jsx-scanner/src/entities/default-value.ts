import {
  isBindingElement,
  isBlock,
  isObjectBindingPattern,
  isVariableStatement,
  type Node,
  type ParameterDeclaration,
  type SourceFile,
} from 'typescript';
import type { FunctionNode } from '../parsers/function-parser.ts';

type DefaultValueKey = string;
type DefaultValue = string;

/**
 * A collection of default values set by destructuring assignment.
 */
export class DefaultValueCollection extends Map<DefaultValueKey, DefaultValue> {
  constructor(entries?: [DefaultValueKey, DefaultValue][]) {
    super(entries);
  }

  setBy(node: Node, sourceFile?: SourceFile) {
    if (isBindingElement(node) && node.initializer) {
      const key = node.name.getText(sourceFile);
      const defaultValue = node.initializer.getText(sourceFile);

      super.set(key, defaultValue);
    }
  }

  get(key: DefaultValueKey): DefaultValue | undefined {
    return super.get(key);
  }
}

type FindDefaultValuesArgs = {
  node: FunctionNode;
  sourceFile: SourceFile;
  parameter?: ParameterDeclaration;
};

/**
 * Find any default values of a function that have been set by destructuring in a parameter or body.
 */
export function findDefaultValueCollection(
  { node, parameter, sourceFile }: FindDefaultValuesArgs,
): DefaultValueCollection {
  const defaultValueCollection = new DefaultValueCollection();

  if (!parameter) return defaultValueCollection;

  // Check for default values in the parameter
  if (isObjectBindingPattern(parameter.name)) {
    parameter.name.elements.forEach((element) => {
      defaultValueCollection.setBy(element, sourceFile);
    });
  }

  // Check for defaults values in the body of the function
  if (node.body && isBlock(node.body)) {
    const parameterName = parameter.name.getText(sourceFile);

    const variableStatements = node.body.statements.filter(isVariableStatement);
    const declarationList = variableStatements.flatMap((declaration) => declaration.declarationList.declarations);

    declarationList.forEach((declaration) => {
      const name = declaration.initializer?.getText(sourceFile);

      if (name === parameterName) {
        declaration.name.forEachChild((element) => {
          defaultValueCollection.setBy(element, sourceFile);
        });
      }
    });
  }

  return defaultValueCollection;
}
