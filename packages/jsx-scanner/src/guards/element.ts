const REACT_ELEMENT_GENERIC_TYPES = [
  'ForwardRefExoticComponent',
  'React.ForwardRefExoticComponent',
  'ReactElement',
  'React.ReactElement',
  'MemoExoticComponent',
  'React.MemoExoticComponent',
] as const;

const REACT_ELEMENT_TYPES = [
  'React.JSX.Element',
  'React.ReactElement',
  'ReactElement',
  'React.ReactNode',
  'ReactNode',
] as const;

const JSX_ELEMENT_TYPES = [
  'Element',
  'JSX.Element',
] as const;

type TypeString = string | undefined;

function isReactElementGenericType(typeString: TypeString): boolean {
  return REACT_ELEMENT_GENERIC_TYPES.some((generic) => typeString?.startsWith(`${generic}<`));
}

function isReactElementType(typeString: TypeString): boolean {
  return REACT_ELEMENT_TYPES.some((element) => typeString === element);
}

function isJsxElementType(typeString: TypeString): boolean {
  return JSX_ELEMENT_TYPES.some((element) => typeString === element);
}

export function isElementType(typeString: TypeString): boolean {
  return isJsxElementType(typeString)
    || isReactElementType(typeString)
    || isReactElementGenericType(typeString);
}
