import * as React from 'react';

function SimpleComponent() {
  return <button type="button" autoFocus={false} contentEditable={true}>Simple Component</button>;
}

export function Hello() {
  return <SimpleComponent />;
}
