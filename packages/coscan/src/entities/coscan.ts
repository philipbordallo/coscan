import { jsonReporter, JsonReporterConfig } from '@coscan/json-reporter';
import { jsxScanner } from '@coscan/jsx-scanner';

type Reporter = JsonReporterConfig;

const DEFAULT_REPORTER: Reporter = {
  type: 'json',
  detail: 'raw',
};

export type CoscanConfig = {
  /** Files to be scanned, can be an entry into an app or individual files. */
  files: string[];
  reporter?: Reporter;
};

export async function coscan({ files, reporter = DEFAULT_REPORTER }: CoscanConfig) {
  const discoveries = await jsxScanner({
    files,
  });

  if (reporter.type === 'json') {
    return jsonReporter(discoveries, reporter);
  }
}
