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
import { isBooleanLiteral } from '../guards/boolean-literal.ts';
import { isNullLiteral } from '../guards/null-literal.ts';
import { trimQuotes } from './string.ts';

export type Prop = string;
export type PropValue = string | boolean | ObjectPropValue | ExpressionPropValue | null | undefined;
export type Props = {
  [prop: Prop]: PropValue;
};

type ExpressionPropValue = `Expression -> ${string}`;

function formatExpression(value: string): ExpressionPropValue {
  return `Expression -> ${value}`;
}

type PropertyAssignmentValue =
  | string
  | number
  | boolean
  | PropertyAssignmentValue[]
  | ObjectPropValue
  | null
  | undefined;

function getPropertyAssignmentValue(initializer: Expression, sourceFile?: SourceFile): PropertyAssignmentValue {
  if (isStringLiteral(initializer)) {
    return trimQuotes(initializer.getText(sourceFile));
  }

  if (isNumericLiteral(initializer) || isBooleanLiteral(initializer)) {
    return JSON.parse(initializer.getText(sourceFile));
  }

  if (isArrayLiteralExpression(initializer)) {
    return initializer.elements.map((element) => getPropertyAssignmentValue(element, sourceFile));
  }

  if (isObjectLiteralExpression(initializer)) {
    return parseObjectExpression(initializer, sourceFile);
  }

  if (isIdentifier(initializer)) {
    return formatExpression(initializer.getText(sourceFile));
  }

  if (isNullLiteral(initializer)) {
    return null;
  }
}

type ObjectPropValue = Record<string, unknown>;

function parseObjectExpression(expression: ObjectLiteralExpression, sourceFile?: SourceFile): ObjectPropValue {
  const entries = expression.properties
    .map((property) => {
      if (isPropertyAssignment(property)) {
        const key = property.name.getText(sourceFile);
        const value = getPropertyAssignmentValue(property.initializer, sourceFile);

        return [key, value];
      }

      if (isShorthandPropertyAssignment(property)) {
        const key = property.name.getText(sourceFile);
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

    if (isObjectLiteralExpression(value.expression) && isParsableObjectPropValue) {
      return parseObjectExpression(value.expression, sourceFile);
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
