export type ElementReturn = 'ReactElement' | 'ReactNode' | 'React.JSX.Element' | 'JSX.Element' | 'Element';

export function isElementReturn(returnType: string): returnType is ElementReturn {
  switch (returnType) {
    case 'ReactElement':
    case 'ReactNode':
    case 'React.JSX.Element':
    case 'JSX.Element':
    case 'Element':
      return true;
    default:
      return false;
  }
}
