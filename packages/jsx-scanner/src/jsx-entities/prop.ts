import {
  type CallSignatureDeclaration,
  type Declaration,
  type Expression,
  isArrayLiteralExpression,
  isArrowFunction,
  isCallSignatureDeclaration,
  isFunctionDeclaration,
  isFunctionExpression,
  isIdentifier,
  isJsxAttribute,
  isJsxExpression,
  isNumericLiteral,
  isObjectLiteralExpression,
  isPropertyAssignment,
  isPropertySignature,
  isShorthandPropertyAssignment,
  isStringLiteral,
  type JsxAttributeName,
  type JsxAttributes,
  type JsxAttributeValue,
  type ObjectLiteralExpression,
  type ParameterDeclaration,
  SignatureKind,
  type SourceFile,
  type TypeChecker,
} from 'typescript';
import { isBooleanLiteral } from '../js-entities/boolean.ts';
import { findDefaultValueCollection } from '../js-entities/default-value.ts';
import { isNullLiteral } from '../js-entities/null.ts';
import { trimQuotes } from '../js-entities/string.ts';
import type { ComponentDeclaration } from '../parsers/assign-parser.ts';
import type { FunctionNode } from '../parsers/function-parser.ts';

export type PropName = string;

type ArrayPropValue = PropValue[];
type ObjectPropValue = { [key: string]: PropValue };
type ExpressionPropValue = `Expression -> ${string}`;

export type PropValue =
  | string
  | number
  | boolean
  | ArrayPropValue
  | ObjectPropValue
  | ExpressionPropValue
  | null
  | undefined;

export type PropsInstance = {
  [prop: PropName]: PropValue;
};

type PropMetadata = {
  required: boolean;
  defaultValue?: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'expression' | 'null' | undefined | {} & string;
};

export type PropsDefinition = {
  [prop: PropName]: PropMetadata;
};

function formatExpression(value: string): ExpressionPropValue {
  return `Expression -> ${value}`;
}

type PropertyAssignmentValue = PropValue;

function getPropertyAssignmentValue(node: Expression, sourceFile?: SourceFile): PropertyAssignmentValue {
  if (isBooleanLiteral(node)) {
    return node.getText(sourceFile) === 'true';
  }

  if (isNumericLiteral(node)) {
    return Number(node.getText(sourceFile));
  }

  if (isStringLiteral(node)) {
    return trimQuotes(node.getText(sourceFile));
  }

  if (isArrayLiteralExpression(node)) {
    return node.elements.map((element) => getPropertyAssignmentValue(element, sourceFile));
  }

  if (isObjectLiteralExpression(node)) {
    return parseExpressionToObjectPropValue(node, sourceFile);
  }

  if (isIdentifier(node)) {
    return formatExpression(node.getText(sourceFile));
  }

  if (isNullLiteral(node)) {
    return null;
  }
}

export function parseExpressionToObjectPropValue(
  expression: ObjectLiteralExpression,
  sourceFile?: SourceFile,
): ObjectPropValue {
  const entries = expression.properties
    .map((property) => {
      if (isPropertyAssignment(property)) {
        const key = trimQuotes(property.name.getText(sourceFile));
        const value = getPropertyAssignmentValue(property.initializer, sourceFile);

        return [key, value];
      }

      if (isShorthandPropertyAssignment(property)) {
        const key = trimQuotes(property.name.getText(sourceFile));
        const value = formatExpression(key);

        return [key, value];
      }
    })
    .filter((entry) => entry !== undefined);

  return Object.fromEntries(entries);
}

function getPropValue(
  value?: JsxAttributeValue,
  isParsableObjectPropValue?: boolean,
  sourceFile?: SourceFile,
): PropValue {
  // `<Component prop />`
  if (value === undefined) {
    return true;
  }

  // `<Component prop="value" />`
  if (isStringLiteral(value)) {
    return value.text;
  }

  if (isJsxExpression(value) && value.expression) {
    const expression = value.expression.getText(sourceFile);

    // `<Component prop={true} />`
    if (isBooleanLiteral(value.expression)) {
      return expression === 'true';
    }

    // `<Component prop={expression} />`
    if (isIdentifier(value.expression)) {
      return formatExpression(expression);
    }

    // `<Component prop={null} />`
    if (isNullLiteral(value.expression)) {
      return null;
    }

    // `<Component prop={1} />`
    if (isNumericLiteral(value.expression)) {
      return Number(expression);
    }

    // `<Component prop={{ key: 'value' }} />`
    if (isObjectLiteralExpression(value.expression) && isParsableObjectPropValue) {
      return parseExpressionToObjectPropValue(value.expression, sourceFile);
    }

    return expression;
  }
}

function getPropKey(key: JsxAttributeName, sourceFile?: SourceFile): string {
  return key.getText(sourceFile);
}

/**
 * Create a props instance from a JSX attributes node.
 */
export function createPropsInstance({ properties }: JsxAttributes, sourceFile?: SourceFile): PropsInstance {
  const props: PropsInstance = {};

  properties.forEach((prop) => {
    if (isJsxAttribute(prop)) {
      const key = getPropKey(prop.name, sourceFile);
      const isParsableObjectPropValue = key === 'style';

      props[key] = getPropValue(prop.initializer, isParsableObjectPropValue, sourceFile);
    }
  });

  return props;
}

/**
 * Get if a prop is required.
 */
function getRequired(valueDeclaration: Declaration | undefined): boolean {
  if (!valueDeclaration) return false;

  return isPropertySignature(valueDeclaration) && !valueDeclaration.questionToken;
}

/**
 * Get the props parameter of a function, which is always the first parameter.
 */
export function getPropsParameter(node: FunctionNode | CallSignatureDeclaration): ParameterDeclaration | undefined {
  return node.parameters[0];
}

type PropDefinitionEntry = [
  PropName,
  PropMetadata,
];

type GetFunctionPropDefinitionEntriesArgs = {
  // TODO make this work with ClassLikeDeclaration, React Built in parser
  node: FunctionNode | CallSignatureDeclaration;
  typeChecker: TypeChecker;
  sourceFile: SourceFile;
};

function getFunctionPropDefinitionEntries({
  node,
  typeChecker,
  sourceFile,
}: GetFunctionPropDefinitionEntriesArgs): PropDefinitionEntry[] {
  if (!node) return [];

  const propsParameter = getPropsParameter(node);
  let propEntries: PropDefinitionEntry[] = [];

  if (propsParameter) {
    const propsType = typeChecker.getTypeAtLocation(propsParameter);

    const defaultValueCollection = isCallSignatureDeclaration(node)
      ? new Map()
      : findDefaultValueCollection({ node, parameter: propsParameter, sourceFile });

    typeChecker.getPropertiesOfType(propsType).forEach((prop) => {
      const propType = typeChecker.getTypeOfSymbolAtLocation(prop, propsParameter);

      const type = typeChecker.typeToString(propType);
      const required = getRequired(prop.valueDeclaration);

      const metadata = {
        type,
        defaultValue: defaultValueCollection.get(prop.name),
        required,
      };

      propEntries.push([
        prop.name,
        metadata,
      ]);
    });
  }

  return propEntries;
}

type GetAssignDeclarationArgs = {
  node: ComponentDeclaration;
  typeChecker: TypeChecker;
};

function getAssignDeclaration({
  node,
  typeChecker,
}: GetAssignDeclarationArgs): CallSignatureDeclaration | undefined {
  const signature = typeChecker.getSignaturesOfType(typeChecker.getTypeAtLocation(node), SignatureKind.Call);

  if (signature.length && signature[0].declaration && isCallSignatureDeclaration(signature[0].declaration)) {
    return signature[0].declaration;
  }

  return undefined;
}

type CreatePropsDefinitionArgs = {
  // TODO make this work with ClassLikeDeclaration, React Built in parser
  node: ComponentDeclaration;
  typeChecker: TypeChecker;
  sourceFile: SourceFile;
};

/**
 * Create a definition of props for a component definition.
 */
export function createPropsDefinition({ node, typeChecker, sourceFile }: CreatePropsDefinitionArgs): PropsDefinition {
  let propEntries: PropDefinitionEntry[] = [];

  if (isArrowFunction(node) || isFunctionDeclaration(node) || isFunctionExpression(node)) {
    propEntries = getFunctionPropDefinitionEntries({ node, typeChecker, sourceFile });
  }

  if (isIdentifier(node) || isObjectLiteralExpression(node)) {
    const declaration = getAssignDeclaration({ node, typeChecker });

    if (declaration) {
      propEntries = getFunctionPropDefinitionEntries({ node: declaration, typeChecker, sourceFile });
    }
  }

  return Object.fromEntries(propEntries);
}
