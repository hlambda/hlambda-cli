import path from 'path';
import { writeFile, mkdir, access } from 'fs/promises';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../../utils/loadConfigFromYAML.js';

export const defaultEnv = async (envName, options, program) => {
    await (async () => {
      const cwd = path.resolve(process.cwd());
      console.log('Executing in cwd:'.green, `${cwd}`.yellow);
  
      // Load yaml configuration
      const configuration = await loadConfigFromYAML(options);
  
      const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
      const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';
  
      console.log(envName);

      // Check if configuration has already the env name

      // TODO: Implement this
      throw new Error(errors.FUNCTIONALITY_NOT_IMPLEMENTED);
    })()
      .then(() => {})
      .catch(CLIErrorHandler(program));
  };
  
  export default defaultEnv;