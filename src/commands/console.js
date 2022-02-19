import path from 'path';
import { readFile } from 'fs/promises';
import YAML from 'yaml';

import open from 'open';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const startConsole = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    if (typeof configuration === 'undefined') {
      throw Error(errors.ERROR_CONFIGURATION_FILE_IS_MISSING);
    }

    const endpoint = options?.endpoint ?? configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    // Sanity check to not execute open on evilCalc.exe :) , we only open URLS that start with `http://` or `https://`
    if (`${endpoint}/console`.match(/^https?:\/\//g)) {
      console.log('Starting browser...'.green);
      open(`${endpoint}/console`);
    } else {
      throw new Error(errors.ERROR_INVALID_ENDPOINT_URL);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default startConsole;
