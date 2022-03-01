import path from 'path';
import rimraf from 'rimraf';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../../utils/loadConfigFromYAML.js';

export const deleteEnv = async (envName, options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    // Create env
    const initEnvFilePath = path.resolve(cwd, options.config, 'environments', envName);
    console.log(`Trying to delete environment ${envName}:`.green, `${initEnvFilePath}`.yellow);

    if (
      typeof initEnvFilePath === 'string' &&
      initEnvFilePath !== '' &&
      initEnvFilePath !== '/' &&
      initEnvFilePath !== '/*'
    ) {
      // Sanity check !!!
      console.log(`Removing everything inside ${initEnvFilePath}`.red);
      rimraf.sync(`${initEnvFilePath}`); // Please be careful...
    } else {
      throw new Error(errors.ERROR_DANGEROUS_SANITY_CHECK_DID_NOT_PASS);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default deleteEnv;
