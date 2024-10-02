import React from 'react';

type ButtonComponentProps = {
  children: React.ReactNode;
};

export function ButtonComponent(props: ButtonComponentProps): React.ReactElement {
  const { children } = props;

  return <button>{children}</button>;
}
