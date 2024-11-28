import {
  type Expression,
  isArrayLiteralExpression,
  isIdentifier,
  isJsxAttribute,
  isJsxExpression,
  isNumericLiteral,
  isObjectLiteralExpression,
  isPropertyAssignment,
  isShorthandPropertyAssignment,
  isStringLiteral,
  type JsxAttributeName,
  type JsxAttributes,
  type JsxAttributeValue,
  type ObjectLiteralExpression,
  type SourceFile,
} from 'typescript';
import { isBooleanLiteral } from './guards/boolean-literal.ts';
import { isNullLiteral } from './guards/null-literal.ts';
import { trimQuotes } from './string.ts';

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

export type Props = {
  [prop: PropName]: PropValue;
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
  // If a value is not defined, it means the prop is a boolean
  if (value === undefined) {
    return true;
  }

  if (isStringLiteral(value)) {
    return value.text;
  }

  if (isJsxExpression(value) && value.expression) {
    const expression = value.expression.getText(sourceFile);

    if (isBooleanLiteral(value.expression)) {
      return expression === 'true';
    }

    if (isIdentifier(value.expression)) {
      return formatExpression(expression);
    }

    if (isNullLiteral(value.expression)) {
      return null;
    }

    if (isNumericLiteral(value.expression)) {
      return Number(expression);
    }

    if (isObjectLiteralExpression(value.expression) && isParsableObjectPropValue) {
      return parseExpressionToObjectPropValue(value.expression, sourceFile);
    }

    return expression;
  }
}

function getPropKey(key: JsxAttributeName, sourceFile?: SourceFile): string {
  return key.getText(sourceFile);
}

export function getProps({ properties }: JsxAttributes, sourceFile?: SourceFile): Props {
  const props: Props = {};

  properties.forEach((prop) => {
    if (isJsxAttribute(prop)) {
      const key = getPropKey(prop.name, sourceFile);
      const isParsableObjectPropValue = key === 'style';

      props[key] = getPropValue(prop.initializer, isParsableObjectPropValue, sourceFile);
    }
  });

  return props;
}
