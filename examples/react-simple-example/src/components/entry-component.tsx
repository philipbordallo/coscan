import * as React from 'react';
import { AnotherComponent } from '../components/simple-component';
import { SimpleComponent } from './simple-component';

export function Entry() {
  return (
    <>
      <SimpleComponent disabled key="1" />
      <AnotherComponent key="2" />
    </>
  );
}
