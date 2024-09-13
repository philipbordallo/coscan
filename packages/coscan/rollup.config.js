import { createRollupConfig } from '@coscan/devtools';
import pkg from './package.json' with { type: 'json' };

export default createRollupConfig(pkg);
