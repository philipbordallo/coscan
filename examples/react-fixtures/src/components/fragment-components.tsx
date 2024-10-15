import React, { Fragment } from 'react';

export function UnnamedFragmentComponent() {
  return <>Hello, world!</>;
}

export function ReactFragmentComponent() {
  return <React.Fragment>Hello, world!</React.Fragment>;
}

export function FragmentComponent() {
  return <Fragment>Hello, world!</Fragment>;
}
