import { createHash } from 'crypto';

export type UniqueId = string;

export function createUniqueId(string: string): UniqueId {
  const hash = createHash('sha1').update(string);

  return hash.digest('hex');
}
