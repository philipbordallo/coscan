import * as React from 'react';

import { Hello } from './components/hello-component.tsx';
import {
  AnotherComponent,
  ArrowComponent,
  Example,
  ExpressionComponent,
  SimpleComponent,
} from './components/simple-component.tsx';

export function App() {
  return (
    <>
      <ExpressionComponent />
      <ArrowComponent />
      <SimpleComponent disabled={true} />
      <Example />
      <Hello />
      <SimpleComponent disabled key="1" />
      <AnotherComponent key="2" />
    </>
  );
}
