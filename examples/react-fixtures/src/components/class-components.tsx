import * as React from 'react';

export const ClassExpressionComponent = class extends React.Component {
  render() {
    return <div />;
  }
};

export class ClassDeclarationComponent extends React.Component {
  render() {
    return <div />;
  }
}

export default class extends React.Component {
  render() {
    return <div />;
  }
}
