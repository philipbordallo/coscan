import chalk from 'chalk';
import meow from 'meow';
import { writeFile } from 'node:fs/promises';
import ora from 'ora';
import { coscan, type Reporter } from './entities/coscan.ts';

const HELP_TEXT = `
  Usage
    $ coscan <files> <options>

  Files
    List of files to scan

  Options
    --output, -o : File to output results to
    --reporter, -r : Reporter to use, formats as \`type:detail\` (default: \`json:raw\`)

  Examples
    $ coscan src/app.tsx --output results.json --reporter json:raw
`;

function getReporter(reporterFlag: unknown): Reporter | undefined {
  if (typeof reporterFlag !== 'string') {
    return undefined;
  }

  const [type, detail] = reporterFlag.split(':');

  return {
    type,
    detail,
  } as Reporter;
}

function getOutput(outputFlag: unknown): string | undefined {
  if (typeof outputFlag !== 'string') {
    return undefined;
  }

  return outputFlag;
}

const spinner = ora('Scanning files...');

type RunData = {
  results: string;
  output: string | undefined;
};

async function run(): Promise<RunData> {
  const cli = meow({
    importMeta: import.meta,
    flags: {
      output: {
        shortFlag: 'o',
      },
      reporter: {
        shortFlag: 'r',
        default: 'json:raw',
        choices: ['json:raw', 'json:count'],
      },
    },
    help: HELP_TEXT,
  });

  const files = cli.input;
  const reporter = getReporter(cli.flags.reporter);
  const output = getOutput(cli.flags.output);

  spinner.start();
  const report = await coscan({
    files,
    reporter,
  });

  if (!report) {
    throw new Error('Error while generating report, please check your configuration.');
  }

  return {
    results: JSON.stringify(report, null, 2),
    output,
  };
}

async function handleSuccess(data: RunData) {
  if (data.output) {
    await writeFile(data.output, data.results);
    spinner.succeed(`Scanning complete, results saved to ${chalk.bold(data.output)}.`);

    return;
  }

  spinner.succeed('Scanning complete!');
  console.log(data.results);
}

function handleError(error: Error) {
  spinner.fail(`${chalk.red('FAIL')} ${error.message}`);
  process.exit(1);
}

run()
  .then(handleSuccess)
  .catch(handleError);
