import {
  isIdentifier,
  isJsxAttribute,
  isJsxExpression,
  isStringLiteral,
  type JsxAttributeName,
  type JsxAttributes,
  type JsxAttributeValue,
  type SourceFile,
} from 'typescript';
import { isBooleanLiteral } from '../guards/boolean-literal.ts';

export type Prop = string;
export type PropValue = string | boolean | undefined;
export type Props = {
  [prop: Prop]: PropValue;
};

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
      return `Expression: {${expression}}`;
    }
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
