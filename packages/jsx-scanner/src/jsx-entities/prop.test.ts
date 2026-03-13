import { describe, expect, it } from '@coscan/test';
import { type JsxAttributes, type ObjectLiteralExpression } from 'typescript';
import { queryNodeBy, queryVariableDeclaration } from '../test-utilities/test-query.ts';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { createPropsInstance, parseExpressionToObjectPropValue } from './prop.ts';

describe(parseExpressionToObjectPropValue.name, () => {
  it('parses booleans, arrays, objects, identifiers, and null values', () => {
    const content = `
      const example = {
        active: true,
        values: [1, 'two', false],
        style: { width: 10 },
        refValue,
        nullable: null,
      };
    `;

    const sourceFile = createTestSourceFile({ content });
    const declaration = queryVariableDeclaration(sourceFile);
    const expression = declaration.initializer as ObjectLiteralExpression;

    const props = parseExpressionToObjectPropValue(expression, sourceFile);

    expect(props).toEqual({
      active: true,
      values: [1, 'two', false],
      style: {
        width: 10,
      },
      refValue: 'Expression -> refValue',
      nullable: null,
    });
  });
});

describe(createPropsInstance.name, () => {
  it('returns the original expression text for non-special jsx expressions', () => {
    const content = `
      const view = <Component data-value={foo + bar} />;
    `;

    const sourceFile = createTestSourceFile({
      content,
      fileName: 'test.tsx',
    });

    const attributes = queryNodeBy<JsxAttributes>('JsxAttributes', sourceFile);

    const props = createPropsInstance(attributes, sourceFile);

    expect(props).toEqual({
      'data-value': 'foo + bar',
    });
  });
});
