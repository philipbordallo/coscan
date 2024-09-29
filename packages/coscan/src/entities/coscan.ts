import { JsonReporter, jsonReporter } from '@coscan/json-reporter';
import { jsxScanner } from '@coscan/jsx-scanner';

export type Reporter = JsonReporter;

const DEFAULT_REPORTER: JsonReporter = {
  type: 'json',
  detail: 'raw',
};

export type CoscanConfig = {
  /** Files to be scanned, can be an entry into an app or individual files. */
  files: string[];
  reporter?: Reporter;
};

export async function coscan({
  files,
  reporter = DEFAULT_REPORTER,
}: CoscanConfig) {
  const discoveries = await jsxScanner({
    files,
  });

  if (reporter.type === 'json') {
    return jsonReporter(discoveries, { detail: reporter.detail });
  }
}
