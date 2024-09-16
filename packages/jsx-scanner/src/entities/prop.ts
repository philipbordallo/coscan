import {
  isIdentifier,
  isJsxAttribute,
  isJsxExpression,
  isObjectLiteralExpression,
  isPropertyAssignment,
  isStringLiteral,
  type JsxAttributeName,
  type JsxAttributes,
  type JsxAttributeValue,
  type SourceFile,
} from 'typescript';
import { isBooleanLiteral } from '../guards/boolean-literal.ts';

export type Prop = string;
export type PropValue = string | boolean | Record<string, string> | undefined;
export type Props = {
  [prop: Prop]: PropValue;
};

function formatExpression(value: string): string {
  return `Expression -> ${value}`;
}

function getPropValue(value?: JsxAttributeValue, sourceFile?: SourceFile): PropValue {
  // If a value is not defined, it means the prop is a boolean
  if (value === undefined) {
    return true;
  }

  if (isStringLiteral(value)) {
    return value.text;
  }

  // If the value is an expression, check if it's a boolean or an identifier
  if (isJsxExpression(value) && value.expression) {
    const expression = value.expression.getText(sourceFile);

    if (isBooleanLiteral(value.expression)) {
      return expression === 'true';
    }

    if (isIdentifier(value.expression)) {
      return formatExpression(expression);
    }

    if (isObjectLiteralExpression(value.expression)) {
      const entries = value.expression.properties
        .map((prop) => {
          if (isPropertyAssignment(prop)) {
            const key = prop.name.getText(sourceFile);
            const initializer = prop.initializer.getText(sourceFile);

            const value = isStringLiteral(prop.initializer)
              ? initializer.replace(/['"]+/g, '')
              : formatExpression(initializer);

            return [key, value];
          }
        })
        .filter((entry) => entry !== undefined);

      return Object.fromEntries(entries);
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

      props[key] = getPropValue(prop.initializer, sourceFile);
    }
  });

  return props;
}
