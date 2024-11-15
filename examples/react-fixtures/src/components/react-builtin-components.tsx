import React from 'react';

export const ReactMemoComponent = React.memo(() => {
  return <div />;
});

export const ReactForwardRefComponent = React.forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} />;
});

export const ReactCreateElementComponent = () => {
  return React.createElement('div', { 'data-example': true }, React.createElement('span', {}));
};
