import { describe, expect, it } from '@jest/globals';
import { queryNodeBy } from '../test-utilities/test-query.ts';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { isFunctionCall } from './function-call.ts';

describe(isFunctionCall, () => {
  it('should return true if the node is a function call', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, 'React.createElement', sourceFile)).toBe(true);
  });

  it('should return true if the node is a function call and the name matches one of the array given', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, ['React.createElement'], sourceFile)).toBe(true);
  });

  it('should return false if the node is not a function call', () => {
    const content = 'React.createElement';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('PropertyAccessExpression', sourceFile);

    expect(isFunctionCall(node, 'React.createElement')).toBe(false);
  });

  it('should return false if the node is a function call but the name does not match', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, 'React.create', sourceFile)).toBe(false);
  });

  it('should return false if the node is a function call but the name does not match the array given', () => {
    const content = 'React.createElement("div")';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('CallExpression', sourceFile);

    expect(isFunctionCall(node, ['React.create'], sourceFile)).toBe(false);
  });
});
