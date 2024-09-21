import * as React from 'react';

export function add(a: number, b: number) {
  return a + b;
}

export const ExpressionComponent = function() {
  return <div />;
};

export const ArrowComponent = () => {
  return <div />;
};

type SimpleComponentProps = {
  disabled: boolean;
};

export function SimpleComponent({ disabled }: SimpleComponentProps): JSX.Element {
  const handleClick = () => {};
  const value = true;
  return (
    <button
      style={{ backgroundColor: 'red' }}
      type={`button`}
      onClick={handleClick}
      disabled={disabled}
      autoFocus={false}
      contentEditable={value}
    >
      Simple Component
    </button>
  );
}
export function AnotherComponent() {
  const value = true;
  return <button type="button" autoFocus={false} contentEditable={value}>Simple Component</button>;
}

export function Example() {
  return <AnotherComponent />;
}
