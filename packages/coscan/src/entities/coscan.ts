import { jsxScanner } from '@coscan/jsx-scanner';

export type CoscanConfig = {
  /** Files to be scanned, can be an entry into an app or individual files. */
  files: string[];
};

export async function coscan({ files }: CoscanConfig) {
  const results = await jsxScanner({
    files,
  });

  return results;
}
