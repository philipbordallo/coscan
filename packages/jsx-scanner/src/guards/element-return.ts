export type ElementReturn =
  | 'Element'
  | 'JSX.Element'
  | 'React.JSX.Element'
  | 'React.ReactElement'
  | 'ReactElement'
  | 'React.ReactNode'
  | 'ReactNode';

export function isElementReturn(returnType: string | undefined): returnType is ElementReturn {
  switch (returnType) {
    case 'Element':
    case 'JSX.Element':
    case 'React.JSX.Element':
    case 'React.ReactElement':
    case 'React.ReactNode':
    case 'ReactElement':
    case 'ReactNode':
      return true;
    default:
      return false;
  }
}
