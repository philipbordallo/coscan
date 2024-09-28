import { coscan } from 'coscan';
import { writeFile } from 'node:fs/promises';

async function main() {
  const results = await coscan({
    files: [
      'src/entry.tsx',
    ],
    reporter: {
      type: 'json',
      detail: 'raw',
    },
  });

  await writeFile('output.json', JSON.stringify(results, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
