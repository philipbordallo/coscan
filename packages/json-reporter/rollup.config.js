import { createRollupConfig } from '@coscan/rollup';
import pkg from './package.json' with { type: 'json' };

export default createRollupConfig(pkg);
