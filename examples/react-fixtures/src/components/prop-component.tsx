import React from 'react';

export function StylePropComponent() {
  return <div style={{ backgroundColor: 'red', width: 15 }} />;
}

export function StyleShorthandPropComponent() {
  const color = 'blue';

  return <div style={{ color }} />;
}

export function ExpressionPropComponent() {
  const handleClick = () => {
    console.log('Clicked!');
  };

  return <button onClick={handleClick} />;
}

export function BooleanPropComponent() {
  return <div hidden aria-disabled={false} aria-checked={true} />;
}

export function StringPropComponent() {
  return <div id="example-id" />;
}

export function NullPropComponent() {
  return <div data-attribute={null} />;
}

export function NumberPropComponent() {
  return <button tabIndex={2} />;
}
