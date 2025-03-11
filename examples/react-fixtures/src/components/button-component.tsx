import React from 'react';

type ButtonComponentProps = {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  tabIndex?: number;
  type?: 'button' | 'submit' | 'reset';
};

export function ButtonComponent({
  children,
  type = 'button',
  disabled = false,
  ...rest
}: ButtonComponentProps): React.ReactElement {
  return <button type={type} disabled={disabled} {...rest}>{children}</button>;
}
