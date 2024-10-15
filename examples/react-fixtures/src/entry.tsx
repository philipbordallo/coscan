import React from 'react';
import { ButtonComponent as Button } from './components/button-component.tsx';
import ClassComponent from './components/class-components.tsx';
import { UnnamedFragmentComponent } from './components/fragment-components.tsx';
import { FunctionArrowComponent } from './components/function-components.tsx';
import { ImportComponent } from './components/import-component.tsx';
import { add } from './components/no-component.tsx';
import { StylePropComponent } from './components/prop-component.tsx';
import { ReturnTypeReactElement } from './components/return-type-components.tsx';
import { SubComponent } from './components/sub-components.tsx';

export function Entry() {
  return (
    <>
      <Button>{add(1, 2)}</Button>
      <ClassComponent />
      <UnnamedFragmentComponent />
      <FunctionArrowComponent />
      <ImportComponent />
      <StylePropComponent />
      <ReturnTypeReactElement />
      <SubComponent />
    </>
  );
}
