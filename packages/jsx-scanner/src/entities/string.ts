/** If a string has subparts, get the namespace, otherwise return undefined
 *
 * @example `Table.Header` -> `Table`
 */
export function getNamespace(content: string): string | undefined {
  if (content.includes('.')) {
    const [namespace] = content.split('.');

    return namespace;
  }

  return undefined;
}
