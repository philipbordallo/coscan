import { describe, expect, it } from '@jest/globals';
import { queryNodeBy } from '../test-utilities/test-query.ts';
import { createTestSourceFile } from '../test-utilities/test-source-file.ts';
import { isInitializedVariable } from './variable.ts';

describe(isInitializedVariable, () => {
  it('should return true if the variable is initialized', () => {
    const content = 'const hello = "world"';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('VariableDeclaration', sourceFile);

    expect(isInitializedVariable(node)).toBe(true);
  });

  it('should return false if the variable is not initialized', () => {
    const content = 'const hello';

    const sourceFile = createTestSourceFile({ content });
    const node = queryNodeBy('VariableDeclaration', sourceFile);

    expect(isInitializedVariable(node)).toBe(false);
  });
});
